const { readData } = require('../lib/firebase.js');
const getUserProfile = require("../backend/userProfile.js")
module.exports = async (req, res) => {
    const db = await readData()
    const userProfile = await getUserProfile(req.session.email)
    if (userProfile) {
        res.json({
            userProfile,
            totalUsers: Object.keys(db.users).length
        })
    } else {
        res.status(404).json({
            error: "Lu Aja Belum Login Jir"
        })
    }
}