const loginUser = require("../backend/userLogin.js")
module.exports = async (req, res) => {
    const {
        email,
        password
    } = req.body
    const result = await loginUser(email, password)
    //console.log(result)
    if (result.success) {
        req.session.email = email
        res.json({
            success: true,
            message: "Login sukses!"
        })
    } else {
        res.json(result)
    }
}