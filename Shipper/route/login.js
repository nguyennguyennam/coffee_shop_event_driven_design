const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Hiển thị form đăng nhập
router.get('/', (req, res) => {
    res.render('login', { error: null }); // truyền error null lần đầu
});

// Xử lý đăng nhập
router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Đọc file JSON chứa danh sách shiper
    const filePath = path.join(__dirname, '../shiper.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            return res.status(500).send('Lỗi máy chủ');
        }

        try {
            const json = JSON.parse(data);
            const user = json.users.find(u => u.name === username && u.password === Number(password));

            if (user) {
                // Đăng nhập thành công
                return res.redirect('/ship');
            } else {
                // Sai thông tin
                return res.render('login', { error: 'Sai tài khoản hoặc mật khẩu' });
            }
        } catch (e) {
            console.error('Lỗi parse JSON:', e);
            return res.status(500).send('Lỗi dữ liệu');
        }
    });
});

module.exports = router;
