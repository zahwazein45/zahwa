process.on('uncaughtException', console.error);
require('./settings')
const __path = process.cwd()
const express = require('express');
const app = express();
const createError = require('http-errors');
const main = require('./routes/main')
const api = require('./routes/api')
app.set('trust proxy', true);
app.set("json spaces", 2)
app.use(express.static("public"))
app.use('/', main)
app.use('/api', api)
app.use(function(req, res, next) {
   next(createError(404))
})
app.use(function(err, req, res, next) {
   res.sendFile(__path + '/view/404.html')
})
/*app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "./view/404.html"))
});*/
// red','green','yellow','blue','magenta','cyan','white']
/*app.listen(PORT, () => {
   console.log("Server running on port " + PORT)
})*/
/*const express = require('express'); // Jika menggunakan Express.js
const app = express();
*/
const DEFAULT_PORT = 8080
const findAvailablePort = (port) => {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            server.close(() => resolve(port)); // Jika berhasil, tutup server
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                resolve(findAvailablePort(port + 1)); // Coba port berikutnya
            } else {
                reject(error); // Tangani error lain
            }
        });
    });
};


const routeNames = api.stack
  .map(layer => {
    const match = layer.regexp.toString().match(/^\/(.*)\/?$/);
    return match ? match[1] : null;
  })
  .filter(Boolean); // Remove any null values
const after = routeNames.map(item => item.replace(/^\^\\\/|\\\/\?\\\$\/i/g, '').replace(/\\\/\?\$\/i/g, '').replace(/\\\//g, ''));

findAvailablePort(DEFAULT_PORT)
    .then((port) => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(after);
        });
    })
    .catch((error) => {
        console.error('Error starting server:', error);
    });
//ini kan ip address nya udh di index.js nah itu kan index.html

const fetch = require('node-fetch');

global.ip_address = ""; // Deklarasi variabel global

async function ipAddress() {
    const data = await (await fetch('https://api.ipify.org?format=json')).json();
    console.log(data.ip);
    global.ip_address = data.ip; // Simpan IP ke variabel global
    return data;
};

// Panggil fungsi ini saat aplikasi dimulai
ipAddress();

// Extracting route names from api.stack

// Log the result
//console.log();
//const serverless = require("serverless-http")
//const router = express.Router();
//module.exports = app
