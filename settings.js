global.creator = '© Ruhend'
const cron = require('node-cron');
const { readData, writeData } = require('./lib/firebase.js');
cron.schedule('0 23 * * *', async () => {
    try {
        const db = await readData();  // Ambil data dari database
        const limit = 100       
        db.users.forEach(user => {
            user.limit = limit;
        });      
        await writeData(db);
        const caption = `Berhasil Menambah ${limit} Limit ke setiap pengguna\n`;
        console.log(caption);
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
}, {
    timezone: "Asia/Jakarta"
});