/*
const fs = require('fs');
const db = JSON.parse(fs.readFileSync('./database.json'));
*/
const { readData, writeData } = require('../lib/firebase.js');
async function registerUser(username, email, password) {    
    const db = await readData()
    const limit = 50
    if (!Array.isArray(db.users)) db.users = []
    const userExists = db.users.some(user => user.email === email)
    if (userExists) {
        return {
            success: false,
            message: "Maybe the email is already in the database"
        }
    }
    const authKey = generateRandomString()
    db.users.push({
        username,
        email,
        password,
        limit: limit,
        authKey: authKey
    })
    //user.authKey = authKey
    db.keys.push(authKey)
    await writeData(db)
    return {
        success: true,
        message: "Registration successful!!"
    }
}

function generateRandomString(length = 6) {
    let anu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const anuLength = anu.length
    for (let i = 0; i < length; i++) {
        result += anu.charAt(Math.floor(Math.random() * anuLength))
    }
    return result
}
module.exports = registerUser