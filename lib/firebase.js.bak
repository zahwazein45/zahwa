//zanasa
const fs = require ('fs')
const admin = require('firebase-admin');
const serviceAccount = require('./key.json')
const databaseURL = "https://data-c88c7-default-rtdb.firebaseio.com"
const path = "/data"
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
});
async function readDataFromFirebase() {
    try {
        const _db = await admin.database();
        const ref = await _db.ref(path);
        const snapshot = await ref.once('value');
        const response = await snapshot.val();
        const data = await JSON.parse(response);
       // console.log('Readed √\n' + JSON.stringify(data, 0, 2));
        //fs.writeFileSync('./database.json', JSON.stringify(data, 0, 2))
        return data
    } catch (error) {
        return console.error('Terjadi kesalahan saat membaca data:', error);
    }
}
exports.readData = readDataFromFirebase
//readDataFromFirebase();

async function writeDataToFirebase(data) {
    try {
        const jsonData = JSON.stringify(data)
        const _db = await admin.database();
        const ref = await _db.ref(path);
        await ref.set(jsonData);
        console.log('Uploaded √\n' + jsonData);
    } catch (error) {
        return console.error('Terjadi kesalahan saat menulis data:', error);
    }
}
exports.writeData = writeDataToFirebase
const db = {
    users: [],
    keys: []
}
//writeDataToFirebase(db);