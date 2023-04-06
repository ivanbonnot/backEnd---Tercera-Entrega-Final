const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { hashSync, compareSync } = require('bcrypt');
const dbController = require("../controllers/controllerMongoDB");

const users = [];
// const usersMongoDB = [];
let userMongo = {};

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

passport.deserializeUser(function (email, done) {
  const user = users.find(user => user.email === email);
  done(null, user);
});

passport.use('login', new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  const user = users.find(user => user.email === email && compareSync(password, user.password));
  // const usersDB= await dbController.getUser(email)
  // usersMongoDB.push(usersDB);
  // console.log(usersDB)

  // if (usersDB) {
  //   userMongo = usersMongoDB.find(user => user.email === email && compareSync(password, user.password));
  // }

  if (user || userMongo) {
    done(null, user);
    return;
  }
  done(null, false, { message: 'Nombre de usuario o contraseña incorrectos' });
}));

passport.use('register', new LocalStrategy({ passReqToCallback: true },
  (req, username, password, done) => {

    const email = req.body.email
    const existentUser = users.find(user => user.username === username);

    if (existentUser) {
      done(null, false, { message: 'El usuario o el email ya existe' });
      return;
    }

    const user = { email, password: hashSync(password, 10) };
    users.push(user);
    done(null, user);
  }));