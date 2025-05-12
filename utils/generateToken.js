const crypto = require('crypto');

const generateKey = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const JWT_KEY = generateKey(32)
const REFRESH_TOKEN_SECRET = generateKey(32)

console.log('JWT_KEY:', JWT_KEY)
console.log('REFRESH_TOKEN_SECRET:', REFRESH_TOKEN_SECRET);
