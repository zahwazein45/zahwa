const { readData, writeData } = require('../../lib/firebase.js');
const axios = require('axios')
module.exports = async (req, res) => {
    const key = req.query.key;
    const message = req.query.q
    if (!message) {
        return res.status(400).json({
            status: 400,
            message: "Masukan Texnya",
            error: "Please input The Text"
        })
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
    const response = await axios.get('https://itzpire.com/ai/hercai-chat?model=v3&q=' + message)
    const data = response.data.data
    if (data.response) {
        res.status(200).json({
            status: 200,
            request_name: user.username,
            data
        })
        let log = '\nNama: Ai Hercai\n'
        log += 'q: ' + message + '\n'
        log += 'status: Sukses\n'        
        console.log(log)
        user.limit -= 1;
        await writeData(db);
    } else if (!data.response) {
        res.json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: '' // util.format(e)
        });
        let log = '\nNama: AI Hercai\n'
        log += 'pesan: ' + message + '\n'
        log += 'Satus: Gagal\n'       
        console.log(log)
    }
};