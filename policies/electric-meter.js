// test if the publisher is in the whitelist
var requestIp = require('request-ip');

module.exports = function(req, res, next) {
    var clientIp = requestIp.getClientIp(req);
    req.app.models.sensors.findOne({ ip: clientIp, type: 'electric-meter' }, function(err, model) {
        if(err || model === '' || model === null || model === undefined) {
            err = new Error('Unauthorized');
            err.status = 401;
            return next(err)
        }
        req.ip = clientIp;
        next();
    });
};
 