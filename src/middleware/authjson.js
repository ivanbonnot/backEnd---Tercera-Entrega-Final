const { verifyToken } = require("../config/tokenHandler");
const path = require('path')

const auth = (req, res, next) => {
  const token = (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ? req.headers.authorization.split(' ')[1]
    : undefined;

  if (!token) {
    res.sendFile(path.join(process.cwd(), 'public/views/login.ejs'))
    res.redirect('/login')
    return;
  }

  try {
    const decodedData = verifyToken(token);
    req.user = decodedData;

    next();
  } catch (err) {
    res.json({ error: 'No hay credenciales' });
    return;
  }
};

module.exports = auth;
