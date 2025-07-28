const express = require('express');
const session = require("express-session");
const fs = require('fs');
const path = require('path');
const db = require("./db/db");
const jwt = require('jsonwebtoken');
const COOKIE_SECRET = 'your-secret-key'; // Thay thế bằng secret key của bạn
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const getShipperFromCookie = require("./middleware/auth");

const { sendUpdateOrderStatusRequest, claimOrder } = require('./producer'); // Đảm bảo producer.js có startProducer
const { startProducer } = require('./kafka'); // Đảm bảo đã import startProducer nếu nó nằm trong kafka.js
const { consumer, createOrUpdateOrderInOrdersFile, removeOrderFromOrdersFile, readOrdersFromFile  } = require('./consumerWorker'); // Import consumer từ kafka.js
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // hoặc cụ thể domain nếu cần bảo mật
         credentials: true
    }
});

const PORT = 3006;
const ORDERS_FILE = path.join(__dirname, 'orders.json'); // Định nghĩa lại ORDERS_FILE ở đây

// Cấu hình middleware để parse body của request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cấu hình cookie parser
app.use(cookieParser("your-secret-key")); // Thay thế bằng secret key của bạn

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
app.get('/', getShipperFromCookie, (req, res) => {
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
        const result = await db.query("SELECT * FROM shippers WHERE name = $1", [username]);

        if (result.rows.length === 0) {
            return res.render("login", { error: "Tài khoản không tồn tại." });
        }

        const shipper = result.rows[0];

        if (password !== "secret") {
            return res.render("login", { error: "Sai mật khẩu." });
        }

        // Tạo JWT từ thông tin shipper
        const token = jwt.sign({
            id: shipper.id,
            name: shipper.name,
            image: shipper.image
        }, COOKIE_SECRET, { expiresIn: '1d' });

        // Gửi token vào cookie
        res.cookie('shipper_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        });

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

app.post('/orders/:orderId/claim', getShipperFromCookie, async (req, res) => {
    if (!req.session.shipper || !req.session.shipper.id) {
        return res.status(401).json({ message: 'Unauthorized - Shipper not logged in' });
    }
    const orderId = req.params.orderId;
    console.log(`Order ID: ${orderId}`);
    console.log(`📦 [Worker] Nhận yêu cầu claim order ${orderId} từ shipper ${req.session.shipper}`);
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

app.post('/orders/:orderId/complete', getShipperFromCookie, async (req, res) => {
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

async function getAvailableShipper(shippers) {
    try {
        const data = fs.readFileSync(ORDERS_FILE, 'utf8');
        const orders = JSON.parse(data);

        const busyShipperIds = new Set(
            orders
                .filter(order => order.status === 'OrderClaimed')
                .map(order => order.shipperId)
        );

        for (let i = 0; i < shippers.length; i++) {
            if (!busyShipperIds.has(shippers[i].id)) {
                return shippers[i]; // shipper rảnh
            }
        }

        return null; // tất cả shipper đều bận
    } catch (err) {
        console.error('❌ Lỗi khi đọc file orders:', err);
        return null;
    }
}


async function runConsumerWorker() {
    await consumer.connect();
    // CHỈ SUBSCRIBE CÁC TOPIC BẠN MUỐN SHIPPER LẮNG NGHE
    await consumer.subscribe({ topic: 'order-events', fromBeginning: true });
    await consumer.subscribe({ topic: 'order-status-updated', fromBeginning: true });
    await consumer.subscribe({ topic: 'order-claimed', fromBeginning: true });

    console.log('[Worker] Shipper consumer started, waiting for updates...\n');

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value.toString();
            console.log(`[Worker] Received message from "${topic}" (Partition ${partition}): ${value}`);

            try {
                const event = JSON.parse(value);
                const orderId = event.orderId;
                const indexShipper = partition;

                if (topic === 'order-events') {
                    if (event.$type === 'OrderPlaced') {
                        // Thêm đơn hàng mới vào orders.json
                        await createOrUpdateOrderInOrdersFile({
                        ...event,
                        status: 'Pending' // Đặt trạng thái ban đầu
                        });
                        
                        // Gửi thông báo real-time qua socket.io
                        io.emit('newOrder', {
                        orderId: event.orderId,
                        customerId: event.customerId,
                        orderDate: event.orderDate,
                        status: 'Pending',
                        orderItems: event.orderItems,
                        price: event.price
                        });
                        
                        console.log(`🆕 [Worker] Đã thêm đơn hàng mới ${event.orderId} từ order-events`);
                    }
                }

                if (topic === 'order-status-updated') {
                    // Nếu event.newStatus tồn tại, ưu tiên nó làm status mới
                    // Nếu không, status của orderData sẽ là event.status (nếu có)
                    const statusToUse = event.newStatus || event.status; 
                    

                if (event.newStatus === 'Payment') {
                    try {
                        const result = await db.query("SELECT id FROM shippers ORDER BY id");
                        const shippers = result.rows;


                        if (shippers.length === 0) {
                            console.warn('⚠️ Không có shipper nào trong DB.');
                            return;
                        }

                        const availableShipper = await getAvailableShipper(shippers);
                        if (!availableShipper) {
                            console.warn('⛔ Tất cả shipper đang bận, không thể gán đơn.');
                            io.emit('orderDeliveredUI', {
                            orderId: 'cancel'});
                            return;
                        }

                        await createOrUpdateOrderInOrdersFile({ ...event, status: statusToUse });
                        console.log(`[Worker] Đã xử lý trạng thái "${statusToUse}" cho đơn hàng ${orderId}`);

                        io.emit('orderPaymentUpdated', {
                            orderId: event.orderId,
                            status: 'Payment',
                            shipperId: availableShipper.id
                        });

                    } catch (err) {
                        console.error('❌ Lỗi khi lấy shipper từ DB:', err);
                    }
                }
                // Nếu trạng thái là "Order Delivered", xóa order khỏi orders.json                 
                    
                    if (event.newStatus === 'Order Delivered') { // Xử lý Order Delivered từ topic này
                        io.emit('orderDeliveredUI', {
                            orderId: event.orderId});
                        await removeOrderFromOrdersFile(orderId);
                        console.log(`📦 [Worker] Đã xử lý trạng thái Delivered cho đơn hàng ${orderId} và xóa khỏi ${ORDERS_FILE}`);
                    }
                } else if (topic === 'order-claimed') {
                    // Gửi toàn bộ event object vào hàm, cùng với trạng thái mới
                    await createOrUpdateOrderInOrdersFile({ ...event, status: 'OrderClaimed' });
                    console.log(`📦 [Worker] Đã xử lý trạng thái OrderClaimed cho đơn hàng ${orderId} bởi shipper ${event.shipperId}`);
                } else {
                    console.log(`[Worker] Event từ topic không được mong đợi: ${topic}`);
                }

            } catch (err) {
                console.error('[Worker] Error processing message:', err.message || err);
                console.error('[Worker] Raw message that caused error:', value);
            }
        },
    });
}

runConsumerWorker().catch(err => {
    console.error('[Worker] Error in consumer worker:', err);
});

server.listen(PORT, async () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    await startProducer(); // Khởi động producer (đảm bảo producer.js của bạn export hàm này)
});