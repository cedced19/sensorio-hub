var express = require('express');
var requestIp = require('request-ip');
var passport = require('passport');
var router = express.Router();

/* GET IP: a tool to get the ip to use in the whitelist */
router.get('/ip', function(req, res, next) {
    var clientIp = requestIp.getClientIp(req);
    console.log('\x1b[36mThe address IP of the sensor is:\x1b[0m', clientIp);
    res.send(clientIp);
});


module.exports = router;
