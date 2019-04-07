var express = require('express');
var router = express.Router();
var requestIp = require('request-ip');

/* POST Distance: update value of a fill rate cylinder sensor */
router.post('/', function (req, res, next) {
    var clientIp = requestIp.getClientIp(req);
    req.app.models.sensors.findOne({ ip: clientIp }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        if(model.type != 'fill-rate-cylinder-sensor') {
            err = new Error('Unauthorized');
            err.status = 401;
            return next(err)
        }
        model.value = Number(req.body.distance);
        req.app.models.sensors.update({ ip: clientIp }, model, function(err, model) {
            if(err) return next(err);
            res.json(model[0]);
        });
    });
    
});


module.exports = router;
