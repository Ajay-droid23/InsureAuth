const crypto = require('crypto');

exports.generateOTP = (length = 6) => {
 
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  
};