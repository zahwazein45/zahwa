function isAuthenticated(req, res, next) {
    if (req.session && req.session.email) {
        next()
    } else {
        res.redirect("/login")
    }
}

module.exports = isAuthenticated