var Waterline = require('waterline');

var Sensors = Waterline.Collection.extend({
    identity: 'sensors',
    connection: 'mongo',
    autoCreatedAt: false,
    autoUpdatedAt: false,

    attributes: { 
        ip: {
            type: 'string',
            required: true,
            unique: true
        },
        name: {
            type: 'string',
            required: true
        },
        type: {
            type: 'string',
            required: true
        }
    }
});

module.exports = Sensors;
