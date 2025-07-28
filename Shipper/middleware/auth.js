const jwt = require('jsonwebtoken');
const SHIPPER_SECRET = 'your-secret-key'; // nên đưa vào .env

function getShipperFromCookie(req, res, next) {
    const token = req.cookies?.shipper_token;
    if (!token) return next();

    try {
        const shipper = jwt.verify(token, SHIPPER_SECRET);
        req.session = req.session || {};
        req.session.shipper = shipper; // hoặc gán vào res.locals.shipper nếu bạn thích
    } catch (err) {
        console.error('Invalid shipper token:', err.message);
    }
    next();
}

module.exports = getShipperFromCookie;