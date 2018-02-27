// test if the publisher is in the whitelist
var requestIp = require('request-ip');
var whitelist = [];
try {
    whitelist = require('../whitelist.json').weather_stations;
} catch (e) {
    throw e;
    process.exit(1);
}   

module.exports = function(req, res, next) {
    var clientIp = requestIp.getClientIp(req); 
    if (whitelist.includes(clientIp)) {
        req.ip = clientIp;
        next();
    } else {
        res.redirect('/login');
    }
    
};
 