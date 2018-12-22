var Waterline = require('waterline');

var format = function(data, cb) {
    if (data.puls) {
        data.number = Number(data.puls);
        delete data.puls
    }
    cb();
  };

var ElectricData = Waterline.Collection.extend({
    identity: 'electricdata',
    connection: 'mongo',
    autoUpdatedAt: false,
    
    attributes: {
        number: 'float',
        ip: 'string'
    },

    beforeCreate: format,
    beforeUpdate: format
});

module.exports = ElectricData;