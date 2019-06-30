var mongoose = require('mongoose');

/* Add a function to format
var format = function (data, cb) {
    data.temperature = Number(data.temperature);
    if (data.temperature2) {
        data.temperature2 = Number(data.temperature2);
    }
    data.humidity = Number(data.humidity);
    data.heat_index = Number(data.heat_index);
    cb();
};
*/

module.exports = new mongoose.Schema({
    temperature: Number,
    temperature2: Number,
    temperature2: Number,
    humidity: Number,
    heat_index: Number,
    ip: String
});
