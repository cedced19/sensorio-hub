var mongoose = require('mongoose');

/* Add a function to format
var format = function(data, cb) {
    if (data.puls) {
        data.number = Number(data.puls);
        delete data.puls
    }
    cb();
  };


*/

module.exports = new mongoose.Schema({
    number: Number,
    ip: String
});