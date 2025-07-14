const express = require('express');
const fs = require('fs');
const path = require('path');
const { runConsumer } = require('./consumer');
const { sendOrderDeliveredEvent } = require('./producer');

const app = express();
const PORT = 3006;

app.set('view engine', 'ejs');
app.use(express.static('public'));

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

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

runConsumer();
