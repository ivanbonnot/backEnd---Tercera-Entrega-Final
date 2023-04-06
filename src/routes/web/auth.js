const { Router } = require('express')
const flash = require('connect-flash');

const path = require('path');
const User = require('../../class/User')
const Cart = require('../../class/Cart')
const dbController = require('../../controllers/controllerMongoDB')

const passport = require('passport');
require('../../config/authPassLocal');
const sendEmail = require('../../helpers/nodeMailer')

const authWebRouter = Router()
authWebRouter.use(flash())



//__LOGIN__//

authWebRouter.get('/login', (req, res) => {
    const nombre = req.session.email
    console.log("20", nombre)
    if (nombre) {
        res.redirect('/')
    } else {
        res.render(path.join(process.cwd(), 'public/views/login.ejs'), { message: req.flash('error') })
    }
})


authWebRouter.post('/login', passport.authenticate('login', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
    req.session.email = req.user.email;
    res.redirect('/')
});



//__REGISTER__//

authWebRouter.get('/register', (req, res) => {
    const nombre = req.session.email
    console.log("39", nombre)
    if (nombre) {
        res.redirect('/')
    } else {
        res.render(path.join(process.cwd(), 'public/views/register.ejs'), { message: req.flash('error') })
    }
})


authWebRouter.post('/register', passport.authenticate('register', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.session.username = req.user.username;
    const { username, email, password, address, phone, avatar } = req.body;

    const cartAdd = new Cart();
    const cart = await dbController.saveCart(cartAdd);

    const newUser = {
        username,
        password,
        email,
        address,
        phone,
        avatar,
        cartId: cart._id,
    }

    const user = await dbController.getUser(email)
    console.log("61", user)

    if (user) {
        console.log("usuario existente ")
    } else {

        const html = `
        <h2>Email: ${email}</h2>
        <h2>Nombre de usuario: ${username}</h2>
        <h2>Dirección: ${address}</h2>
        <h2>Teléfono: ${phone}</h2>
        <h2>Foto: ${avatar}</h2>
         `;

        sendEmail(email, username, html)
        dbController.saveUser(newUser);
    }

    res.redirect('/login');

});



//__LOGOUT__//

authWebRouter.get('/logout', (req, res) => {
    const nombre = req.session.email
    if (nombre) {
        req.session.destroy(err => {
            if (!err) {
                res.render(path.join(process.cwd(), 'public/views/logout.ejs'), { nombre })
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/login')
    }
})


module.exports = authWebRouter 
