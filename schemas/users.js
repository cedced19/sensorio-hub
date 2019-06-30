var mongoose = require('mongoose');
var hash = require('password-hash-and-salt');

/* Add a function to format
var format = function(user, cb) {
    if (user.password) {
        hash(user.password).hash(function(err, crypted) {
          if (err) return cb(err);
          user.password = crypted;
          cb();
        });
    } else {
      cb();
    }
};
*/

module.exports = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
});