const __path = process.cwd()
console.log(__path)
const path = require ('path')
const express = require('express');
const router = express.Router();
const isAuthenticated = require("../system/autentikasi.jsx")
const session = require("express-session")
const bodyParser = require('body-parser')
const { limit, checkBanned } = require("../system/rateLimit.jsx")
const { runtime, fetchJson } = require('../lib/functions')
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
router.get('/', limit, (req, res) => {
   res.sendFile(__path + '/view/index.html')
})

router.get('/docs', limit, (req, res) => {
   res.sendFile(__path + '/view/index.html')
})

router.get("/login", limit, (req, res) => {
    res.sendFile(path.join(__dirname, "../view/login.html"))
})

router.get("/profile", limit, isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../view/profile.html"))
})

router.post('/register', limit, async (req, res) => {
    await require("../system/register.jsx")(req, res)
})
router.post('/login', limit, async (req, res) => {
    await require("../system/login.jsx")(req, res)
})
router.get("/logout", async (req, res) => {
    await require("../system/logout.jsx")(req, res)
})
router.get("/prof", limit, isAuthenticated, async (req, res) => {
    await require("../system/profile.jsx")(req, res)
})
module.exports = router