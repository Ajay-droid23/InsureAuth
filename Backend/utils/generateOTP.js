const crypto = require('crypto');
module.exports = (length = 6) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};