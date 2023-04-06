const jwt = require('jsonwebtoken');

const PRIVATE_KEY = 'my-super-secret';

const generateToken = (user) => jwt.sign(JSON.stringify(user), PRIVATE_KEY);
const verifyToken = (token) => jwt.verify(token, PRIVATE_KEY);

module.exports = { generateToken, verifyToken };
