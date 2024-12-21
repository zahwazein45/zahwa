const express = require('express')
const router = express.Router()
const { limit, checkBanned } = require("../system/rateLimit.jsx")
const session = require("express-session")
const bodyParser = require('body-parser')
router.use(checkBanned)
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(session({
    secret: 'assalamualaikum',
    resave: true,
    saveUninitialized: true,
    cookie: { 
      maxAge: 86400000
    }
}))
// - DOWNLOADER MENU - \\
router.get('/ttdl', limit, async (req, res, next) => {
   await require("./plugins/tiktok.js")(req, res)
});
router.get('/fbdl', limit, async (req, res, next) => {
   await require("./plugins/facebook.js")(req, res)
});
router.get('/igdl', async (req, res, next) => {
   await require("./plugins/instagram.js")(req, res)
});
router.get('/ytmp3', async (req, res, next) => {
   await require("./plugins/ytmp3.js")(req, res)
});
router.get('/ytmp4', async (req, res, next) => {
   await require("./plugins/ytmp4.js")(req, res)
});
router.get('/pinterest', async (req, res, next) => {
   await require("./plugins/pinterest.js")(req, res)
});
router.get('/twitter', async (req, res, next) => {
   await require("./plugins/twitter.js")(req, res)
});
//### AI
router.get('/ai/hercai', async (req, res, next) => {
   await require("./plugins/ai-hercai.js")(req, res)
});
router.get('/ai/llama', async (req, res, next) => {
   await require("./plugins/ai-llama.js")(req, res)
});

module.exports = router