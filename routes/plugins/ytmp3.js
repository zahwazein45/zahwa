const { readData, writeData } = require('../../lib/firebase.js'); 
const {
    ytmp3
} = require('./youtube.js')
module.exports = async (req, res) => {
    const key = req.query.key;
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: 400,
            message: "Url Youtube Nya Mana?",
            error: "Please input url tiktok"
        });
    }
    if (!key) {
        return res.status(403).json({
            status: 400,
            message: "Masukan Apikey Nya",
            error: "Input Parameter Apikey!"
        });
    }
    const db = await readData();
    if (!db.keys.includes(key)) {
        return res.status(403).json({
            status: 403,
            message: "apikey salah atau tidak temukan",
            error: "wrong apikey or apikey not found"
        });
    }
    const user = db.users.find(user => user.authKey === key);
    const data = await ytmp3(url)
    if (Object.keys(data).length > 3) {
        res.json({
            status: 200,
            request_name: user.username,
            message: 'sukses',
            data: data
        })
        let log = '\nNama: ytmp3 \n'
        log += 'url: ' + url + '\n'
        log += 'status: Sukses\n'
        console.log(log)
        user.limit -= 1;
        await writeData(db);
    } else if (Object.keys(data).length == 0) {
        res.json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: data
        });
        let log = '\nNama: ytmp3\n'
        log += 'URL: ' + url + '\n'
        log += 'Satus: Gagal\n'
        console.log(log)
    }
};