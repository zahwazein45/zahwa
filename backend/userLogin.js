//const fs = require('fs');
//const db = JSON.parse(fs.readFileSync('./database.json'));
const { readData } = require('../lib/firebase.js');
async function loginUser(email, password) {
    const db = await readData()
    const user = db.users.find(user => user.email === email && user.password === password)
    //console.log(user.authKey)
    if (user) {
        if (!user.authKey) {
            const authKey = generateRandomString()
            user.authKey = authKey
            db.keys.push(authKey)
            await Backup(db)
        }
        return {
            success: true,
            message: "Login sukses!",
            authKey: user.authKey
        }
    } else {
        return {
            success: false,
            message: "Email or Password invalid."
        }
    }
}
/*function writeDatabase(v) {
   fs.writeFileSync('./database.json', JSON.stringify(v, null, 2));
};
*/
module.exports = loginUser
const generateRandomString = (length = 6) => {
    let anu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const anuLength = anu.length
    for (let i = 0; i < length; i++) {
        result += anu.charAt(Math.floor(Math.random() * anuLength))
    }
    return result
}