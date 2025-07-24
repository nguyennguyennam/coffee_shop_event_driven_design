function requireLogin(req, res, next) {
  if (!req.session.shipper) {
    return res.redirect("/login");
  }
  next();
}

module.exports = requireLogin;
