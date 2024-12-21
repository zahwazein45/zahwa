const { readData, writeData } = require('../../lib/firebase.js'); 
module.exports = async (req, res) => {
    const key = req.query.key;
    const url = req.query.url;
    if (!key) {
        return res.status(403).json({
            status: 400,
            message: "Masukan Apikey Nya",
            error: "Input Parameter Apikey!"
        });
    }
    if (!url) {
        return res.status(400).json({
            status: 400,
            message: "Url Twiter Nya Mana?",
            error: "Please input url twiter"
        })
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
    if (user.limit <= 0) {
        return res.status(400).json({
            status: 400,
            message: "Ups Limit Api Key Habis",
            error: "Sorry Apikey Has Reached The Limit Please Buy To Admin Group Rhnd"
        });
    }
    const data = await downloadTwitter(url)
    if (Object.keys(data).length > 1) {
        res.json({
            status: 200,
            request_name: user.username,
            message: 'sukses',
            data: data
        })
        let log = '\nNama:twitter \n'
        log += 'url: ' + url + '\n'
        log += 'status: Sukses\n'
        
        console.log(log)
        user.limit -= 1;
        await writeData(db);
    } else {
        res.json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: data
        });
        let log = '\nNama: twitter\n'
        log += 'URL: ' + url + '\n'
        log += 'Satus: Gagal\n'       
        console.log(log)
    }
};
const qs = require('qs');
const axios = require('axios')
const cheerio = require('cheerio')
async function downloadTwitter(link) {
  return await new Promise(async (resolve, reject) => {
    try {
    let requestBody = { URL: link };
    await axios.post("https://twdown.net/download.php", qs.stringify(requestBody), {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'sec-ch-ua': "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        cookie: "_ga=GA1.2.1900411916.1734314599; _gid=GA1.2.2029947738.1734314599; __gads=D=d728a7a6b8c8f8d9:T=1734314601:RT=1734314601:S=ALNI_MYEh4_dy0Gk75uJmd4GHWspRa8c-A; _gat=1"
      }
    }).then(({ data }) => {
      const cheerioObject = cheerio.load(data);
      let title = cheerioObject("div:nth-child(1) > div:nth-child(2) > p").text().trim();
      let hdUrl = cheerioObject("tbody > tr:nth-child(1) > td:nth-child(4) > a").attr('href');
      let sdUrl = cheerioObject("tr:nth-child(2) > td:nth-child(4) > a").attr("href");      
      resolve({
        title: title,
        url: { 
           hd: hdUrl,
           sd: sdUrl 
        }
      });
    })
    }  catch  (e) {
      reject (e)
    }
    
  });
}
