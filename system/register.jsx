const registerUser = require("../backend/userRegis.js")
module.exports = async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body
    const result = await registerUser(username, email, password)
    //console.log(result)
    if (result.success) {
        req.session.email = email
        res.json({
            success: true,
            message: "Register sukses!"
        })
        //res.send( "Register Sukses!")
        //res.redirect("/login")   
    } else {
        res.json(result)
    }
}