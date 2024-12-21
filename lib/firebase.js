const fs = require('fs');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

// Fungsi untuk mendapatkan kredensial dari file JSON
const serviceAccount = async () => {
    const res = await fetch("https://pomf2.lain.la/f/9q22avrs.json");
    return res.json();
};

// URL database Firebase
const databaseURL = "https://kontol-9cf17-default-rtdb.firebaseio.com";
const path = "/data";

// Fungsi untuk menginisialisasi Firebase
const initializeFirebase = async () => {
    const credentials = await serviceAccount();
    admin.initializeApp({
        credential: admin.credential.cert(credentials),
        databaseURL: databaseURL
    });
};
initializeFirebase(); 
// Fungsi untuk membaca data dari Firebase
const readDataFromFirebase = async () => {
    try {
       // await initializeFirebase(); 
        const _db = admin.database();
        const ref = _db.ref(path);
        const snapshot = await ref.once('value');
        const response = JSON.parse(snapshot.val()); // Pastikan response adalah objek
        //console.log('Response dari Firebase:', response); // Tampilkan response

        // Pastikan response tidak null dan memiliki properti users
        if (response && response.users) {
            //console.log(response.users); 
           // fs.writeFileSync('data.json', JSON.stringify(response, null, 2))
            return response; // Mengembalikan response
        } else {
            console.log('Tidak ada data pengguna yang ditemukan.');
            return null; // Mengembalikan null jika tidak ada pengguna
        }
    } catch (error) {
        console.error('Terjadi kesalahan saat membaca data:', error);
        return null; // Mengembalikan null jika terjadi kesalahan
    }
};

// Fungsi untuk menulis data ke Firebase
const writeDataToFirebase = async (data) => {
    try {
      // await initializeFirebase();         
       const JsonData = JSON.parse(JSON.stringify(data));
       const jsonData = JSON.stringify(JsonData)
    // Mendapatkan referensi ke database    
       const db = await admin.database();
       const ref = await db.ref(path); // Ganti dengan referensi yang Anda inginkan
    // Menulis data ke Firebase
       await ref.set(jsonData);
       console.log('\nUploaded √\n');    
    } catch (error) {
        console.error('Terjadi kesalahan saat menulis data:', error);
    }
};
exports.readData = readDataFromFirebase
exports.writeData = writeDataToFirebase

