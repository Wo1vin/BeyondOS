const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @desc LOGIN/LANDING PAGE
// @route GET / 
router.get('/', ensureGuest, (req,res) => {
    res.render('login' , {
        layout: 'login'
    })
})

// @desc LOGIN/LANDING PAGE
// @route GET /dashboard
router.get('/dashboard', ensureAuth, (req,res) => {
    res.render('dashboard' , {
        name: req.user.name,
    })
    // console.log(req.user)
})

module.exports = router