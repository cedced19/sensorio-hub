var Waterline = require('waterline');

var format = function(data, cb) {
    data.temperature = Number(data.temperature);
    if (data.temperature2 == 'false') {
        delete data.temperature2;
    } else {
        data.temperature2 = Number(data.temperature2);
    }
    data.humidity = Number(data.humidity);
    data.heat_index = Number(data.heat_index);
    cb();
  };

var WeatherData = Waterline.Collection.extend({
    identity: 'weatherdata',
    connection: 'mongo',
    autoUpdatedAt: false,
    
    attributes: {
        temperature: 'float',
        temperature2: 'float',
        humidity: 'float',
        heat_index: 'float',
        ip: 'string'
    },

    beforeCreate: format,
    beforeUpdate: format
});

module.exports = WeatherData;