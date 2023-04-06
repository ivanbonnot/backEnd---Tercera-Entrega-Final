const { Router } = require('express')
const path = require('path')
const homeWebRouter = Router()
const auth = require('../../middleware/authjson')

homeWebRouter.get('/', (req, res) => {

    const email = req.session.email
    console.log("9", email)

    if (email) {
        res.render(path.join(process.cwd(), 'public/views/home.ejs'), { email })
    } else {
        res.sendFile(path.join(process.cwd(), 'public/views/login.ejs'))
        res.redirect('/login')
    }
})


module.exports = homeWebRouter