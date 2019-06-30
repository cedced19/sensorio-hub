var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost:27017/sensorio', { useNewUrlParser: true });

module.exports = {
    Users: connection.model('Users', require('../schemas/users.js')), 
    Sensors: connection.model('Sensors', require('../schemas/sensors.js')),
    Electricdata: connection.model('Electricdata', require('../schemas/electricdata.js')),
    Weatherdata: connection.model('Weatherdata', require('../schemas/weatherdata.js')),
};