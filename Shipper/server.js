const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http'); // ✅ Thêm http server
const { Server } = require('socket.io'); // ✅ Import socket.io
const { runConsumer } = require('./consumer');
const { sendOrderDeliveredEvent } = require('./producer');

const app = express();
const server = http.createServer(app); // ✅ Tạo server từ app
const io = new Server(server, {
  cors: {
    origin: '*', // hoặc cụ thể domain nếu cần bảo mật
  }
});

const PORT = 3006;

// Cấu hình EJS và static files
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  let orders = [];

  try {
    orders = JSON.parse(fs.readFileSync(path.join(__dirname, 'orders.json'), 'utf8'));
  } catch (_) {}

  res.render('index', { orders });
});

app.post('/orders/:orderId/complete', async (req, res) => {
  const orderId = req.params.orderId;

  try {
    await sendOrderDeliveredEvent(orderId);
    res.status(200).redirect('/');
  } catch (err) {
    console.error('❌ Không gửi được sự kiện:', err);
    res.status(500).json({ error: 'Lỗi gửi sự kiện Kafka' });
  }
});

// Lắng nghe kết nối từ client
io.on('connection', (socket) => {
  console.log('📡 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// 👉 Truyền io vào Kafka consumer
runConsumer(io);

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
