const { readData, writeData } = require('../../lib/firebase.js'); 
module.exports = async (req, res) => {
    const key = req.query.key;
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: 400,
            message: "Url Instagram Nya Mana?",
            error: "Please input url instagram"
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
    if (user.limit <= 0) {
        return res.status(400).json({
            status: 400,
            message: "Ups Limit Api Key Habis",
            error: "Sorry Apikey Has Reached The Limit Please Buy To Admin Group Rhnd"
        });
    }
    const data = await igdl(url)
    if (data.status == true) {
        res.json({
            status: 200,
            request_name: user.username,
            message: 'sukses',
            data: data.data
        })
        let log = '\nNama: Instagram\n'
        log += 'url: ' + url + '\n'
        log += 'status: Sukses\n'
        user.limit -= 1;
        await writeData(db);
        console.log(log)
    } else if (data.status == false) {
        res.json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: data.msg
        });
        let log = '\nNama: Facebook\n'
        log += 'URL: ' + url + '\n'
        log += 'Satus: Gagal\n'
        console.log(log)
    }
};

const cheerio = require('cheerio')
const fetch = require('node-fetch');
async function igdl(url) {
    return new Promise(async (resolve) => {
        try {
            if (!url.match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/) && !url.match(/(https|http):\/\/www.instagram.com\/(p|reel|tv|stories)/gi)) return resolve({
                status: false,
                msg: `Link Url not valid`
            })

            function decodeSnapApp(args) {
                let [h, u, n, t, e, r] = args
                // @ts-ignore
                function decode(d, e, f) {
                    const g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('')
                    let h = g.slice(0, e)
                    let i = g.slice(0, f)
                    // @ts-ignore
                    let j = d.split('').reverse().reduce(function(a, b, c) {
                        if (h.indexOf(b) !== -1)
                            return a += h.indexOf(b) * (Math.pow(e, c))
                    }, 0)
                    let k = ''
                    while (j > 0) {
                        k = i[j % f] + k
                        j = (j - (j % f)) / f
                    }
                    return k || '0'
                }
                r = ''
                for (let i = 0, len = h.length; i < len; i++) {
                    let s = ""
                    // @ts-ignore
                    while (h[i] !== n[e]) {
                        s += h[i];
                        i++
                    }
                    for (let j = 0; j < n.length; j++)
                        s = s.replace(new RegExp(n[j], "g"), j.toString())
                    // @ts-ignore
                    r += String.fromCharCode(decode(s, e, 10) - t)
                }
                return decodeURIComponent(encodeURIComponent(r))
            }

            function getEncodedSnapApp(data) {
                return data.split('decodeURIComponent(escape(r))}(')[1]
                    .split('))')[0]
                    .split(',')
                    .map(v => v.replace(/"/g, '').trim())
            }

            function getDecodedSnapSave(data) {
                return data.split('getElementById("download-section").innerHTML = "')[1]
                    .split('"; document.getElementById("inputData").remove(); ')[0]
                    .replace(/\\(\\)?/g, '')
            }

            function decryptSnapSave(data) {
                return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)))
            }
            const response = await fetch('https://snapsave.app/action.php?lang=id', {
                method: 'POST',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Origin': 'https://snapsave.app',
                    'Referer': 'https://snapsave.app/id',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
                },
                body: new URLSearchParams({
                    url
                }) // Menggunakan URLSearchParams untuk mengirim data
            });
            const html = await response.text();
            const decode = decryptSnapSave(html)
            const $ = cheerio.load(decode)
            const results = []
            if ($('table.table').length || $('article.media > figure').length) {
                const thumbnail = $('article.media > figure').find('img').attr('src')
                $('tbody > tr').each((_, el) => {
                    const $el = $(el)
                    const $td = $el.find('td')
                    const resolution = $td.eq(0).text()
                    let _url = $td.eq(2).find('a').attr('href') || $td.eq(2).find('button').attr('onclick')
                    const shouldRender = /get_progressApi/ig.test(_url || '')
                    if (shouldRender) {
                        _url = /get_progressApi\('(.*?)'\)/.exec(_url || '')?.[1] || _url
                    }
                    results.push({
                        resolution,
                        thumbnail,
                        url: _url,
                        shouldRender
                    })
                })
            } else {
                $('div.download-items__thumb').each((_, tod) => {
                    const thumbnail = $(tod).find('img').attr('src')
                    $('div.download-items__btn').each((_, ol) => {
                        let _url = $(ol).find('a').attr('href')
                        if (!/https?:\/\//.test(_url || '')) _url = `https://snapsave.app${_url}`
                        results.push({
                            thumbnail,
                            url: _url
                        })
                    })
                })
            }
            if (!results.length) return resolve({
                status: false,
                msg: `Blank data`
            })
            return resolve({
                status: true,
                data: results
            })
        } catch (e) {
            return resolve({
                status: false,
                msg: e.message
            })
        }
    })
}