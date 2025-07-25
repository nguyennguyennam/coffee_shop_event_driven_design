const express = require('express');
const session = require("express-session");
const fs = require('fs');
const path = require('path');
const db = require("./db/db");
const http = require('http');
const { Server } = require('socket.io');
const requireLogin = require("./middleware/auth");
const { sendUpdateOrderStatusRequest, claimOrder } = require('./producer'); // Đảm bảo producer.js có startProducer
const { startProducer } = require('./kafka'); // Đảm bảo đã import startProducer nếu nó nằm trong kafka.js

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // hoặc cụ thể domain nếu cần bảo mật
    }
});

const PORT = 3006;
const ORDERS_FILE = path.join(__dirname, 'orders.json'); // Định nghĩa lại ORDERS_FILE ở đây

// Cấu hình middleware để parse body của request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình EJS và static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Lắng nghe kết nối từ client
io.on('connection', (socket) => {
    console.log('📡 Client connected:', socket.id);

    // Gửi danh sách đơn hàng hiện tại khi client kết nối
    try {
        const currentOrders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
        const pendingOrders = currentOrders.filter(o => o.status === 'Pending' || o.status === 'Payment' || o.status === 'OrderClaimed');
        socket.emit('currentOrders', pendingOrders); // Gửi event ban đầu
    } catch (e) {
        console.warn(`WARN: Could not read or parse ${ORDERS_FILE} for initial load on client ${socket.id}.`);
        socket.emit('currentOrders', []);
    }

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });

    // Thêm các listener cho các sự kiện từ client nếu có (ví dụ: client gửi yêu cầu refresh)
});

// Theo dõi thay đổi của file orders.json
fs.watch(ORDERS_FILE, async (eventType, filename) => {
    if (filename && eventType === 'change') {
        try {
            const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
            const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Payment' || o.status === 'OrderClaimed');
            // Gửi toàn bộ danh sách order mới đến tất cả các client
            io.emit('ordersUpdated', pendingOrders); // Gửi event cập nhật
            console.log('📦 Server gửi cập nhật ordersUpdated từ file orders.json đến client');
        } catch (e) {
            console.error('Lỗi khi đọc file orders.json để cập nhật UI:', e);
        }
    }
});


// Routes (giữ nguyên)
app.get('/', (req, res) => {
    let orders = [];
    try {
        orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    } catch (_) { }
    res.render('index', { orders, page: 'ship', user: req.session.shipper || null, CURRENT_SHIPPER_ID: req.session.shipper?.id || null });
});

app.get("/login", (req, res) => {
    if (req.session.shipper) {
        return res.redirect("/");
    }
    res.render("index", { page: 'login', user: null });
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query(
            "SELECT * FROM shippers WHERE name = $1",
            [username]
        );

        if (result.rows.length === 0) {
            return res.render("login", { error: "Tài khoản không tồn tại." });
        }

        const shipper = result.rows[0];

        if (password !== "secret") {
            return res.render("login", { error: "Sai mật khẩu." });
        }

        req.session.shipper = {
            id: shipper.id,
            name: shipper.name,
            image: shipper.image,
        };

        res.redirect("/");

    } catch (err) {
        console.error(err);
        res.render("login", { error: "Có lỗi xảy ra khi đăng nhập." });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Logout failed.");
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

app.post('/orders/:orderId/claim', requireLogin, async (req, res) => {
    const orderId = req.params.orderId;
    const shipperId = req.session.shipper.id;
    try {
        await claimOrder(orderId, shipperId); // Gửi message lên Kafka Producer
        res.status(200).json({ message: 'Order claim request sent successfully to Kafka' });
    } catch (err) {
        console.error('❌ Lỗi khi gửi yêu cầu claim Order lên Kafka:', err);
        const statusCode = err.response?.status || 500;
        const errorDetails = err.response?.data || { error: 'Internal Server Error' };
        res.status(statusCode).json({
            message: 'Failed to claim order.',
            error: errorDetails
        });
    }
});

app.post('/orders/:orderId/complete', async (req, res) => {
    const orderId = req.params.orderId;
    try {
        await sendUpdateOrderStatusRequest(orderId, "Order Delivered", req.session.shipper.id);
        res.status(200).json({ message: 'Order status update request sent successfully to Kafka' });
    } catch (err) {
        console.error('❌ Lỗi khi gửi yêu cầu cập nhật trạng thái Order tới .NET Backend:', err);
        const statusCode = err.response?.status || 500;
        const errorDetails = err.response?.data || { error: 'Internal Server Error' };
        res.status(statusCode).json({
            message: 'Failed to update order status.',
            error: errorDetails
        });
    }
});

server.listen(PORT, async () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    await startProducer(); // Khởi động producer (đảm bảo producer.js của bạn export hàm này)
});