var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var weatherDataSchema = new Schema({
	'humidity' : String,
	'temperature' : String,
	'temperature2' : String,
	'heat_index' : String,
	'sensor_ip' : String
});

module.exports = mongoose.model('weatherData', weatherDataSchema);
