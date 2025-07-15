const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { runConsumer } = require('./consumer');
const { sendUpdateOrderStatusRequest } = require('./producer'); // ✅ Import hàm mới từ producer.js

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // hoặc cụ thể domain nếu cần bảo mật
    }
});

const PORT = 3006;

// ✅ Cấu hình middleware để parse body của request
app.use(express.json()); // Để đọc JSON body
app.use(express.urlencoded({ extended: true })); // Để đọc form data (nếu dùng)

// Cấu hình EJS và static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Đảm bảo đường dẫn đúng đến thư mục views
app.use(express.static(path.join(__dirname, 'public'))); // Đảm bảo đường dẫn đúng đến thư mục public
// Lắng nghe kết nối từ client
io.on('connection', (socket) => {
    console.log('📡 Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});
// Routes
app.get('/', (req, res) => {
    let orders = [];
    try {
        orders = JSON.parse(fs.readFileSync(path.join(__dirname, 'orders.json'), 'utf8'));
    } catch (_) { }
    res.render('index', { orders });
});

// ✅ THAY ĐỔI ROUTE NÀY ĐỂ GỌI API .NET BACKEND
app.post('/orders/:orderId/complete', async (req, res) => {
    const orderId = req.params.orderId;
    // Trạng thái mới, ở đây là 'OrderDelivered'
    const newStatus = 'OrderDelivered'; // Hoặc lấy từ req.body nếu UI gửi lên

    try {
        // ✅ Gọi hàm gửi API request đến .NET Backend
        await sendUpdateOrderStatusRequest(orderId, "Order Delivered"); // Truyền newStatus vào
        
        // Bạn có thể redirect hoặc gửi JSON response tùy ý
        // Nếu redirect, UI sẽ refresh và order có thể bị xóa khỏi localStorage ngay lập tức
        // res.status(200).redirect('/'); 
        
        // Hoặc gửi JSON response để client-side JS xử lý việc xóa khỏi UI
        res.status(200).json({ message: 'Order status update request sent successfully' });
    } catch (err) {
        console.error('❌ Lỗi khi gửi yêu cầu cập nhật trạng thái Order tới .NET Backend:', err);
        // Trả về lỗi chi tiết hơn nếu có response từ backend
        const statusCode = err.response?.status || 500;
        const errorDetails = err.response?.data || { error: 'Internal Server Error' };
        res.status(statusCode).json({
            message: 'Failed to update order status.',
            error: errorDetails
        });
    }
});



// 👉 Truyền io vào Kafka consumer (nếu bạn vẫn muốn lắng nghe OrderPlaced events)
runConsumer(io).catch(console.error); // Thêm .catch để bắt lỗi khởi động consumer

// ✅ Start server
server.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});