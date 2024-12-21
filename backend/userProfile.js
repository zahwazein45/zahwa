//const fs = require('fs');
//const db = JSON.parse(fs.readFileSync('./database.json'));
const { readData } = require('../lib/firebase.js');
async function getUserProfile(email) {
    const db = await readData()
    const user = db.users.find(user => user.email === email)
    if (user) {
        return {
            username: user.username,
            email: user.email,
            authKey: user.authKey,
            limit: user.limit
        }
    } else {
        return 'Profile Tidak Di Temukan'
    }
}
module.exports = getUserProfile