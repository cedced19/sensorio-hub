var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');

/* GET Sensors */
router.get('/', auth, function(req, res, next) {
    req.app.models.sensors.find().exec(function(err, models) {
        if(err) return next(err);
        res.json(models);
    });
});

/* POST Sensor: create a sensor */
router.post('/', auth, function(req, res, next) {
    req.app.models.sensors.create(req.body, function(err, model) {
        if(err) return next(err);
        res.json(model);
    });
});

/* GET Sensor */
router.get('/:ip', auth, function(req, res, next) {
    req.app.models.sensors.findOne({ ip: req.params.ip }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        delete model.password;
        res.json(model);
    });
});

/* PUT Sensor */
router.put('/:ip', auth, function(req, res, next) {
    req.app.models.sensors.update({ ip: req.params.ip }, req.body, function(err, model) {
        if(err) return next(err);
        res.json(model[0]);
    });
});

/* DELETE Sensor */
router.delete('/:ip', auth, function(req, res, next) {
    req.app.models.sensors.findOne({ ip: req.params.ip }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        req.app.models.sensors.destroy({ ip: req.params.ip }, function(err) {
            if(err) return next(err);
            if (model.type == 'weather-station') {
                req.app.models.weatherdata.destroy({ ip: req.params.ip }, function(err) {    
                    if(err) return next(err);    
                    res.json({ status: true });            
                });
            } else {
                res.json({ status: true });
            }
        });
    });
});

module.exports = router;
