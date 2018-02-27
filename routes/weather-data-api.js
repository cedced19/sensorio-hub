var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');
var isWeatherStation = require('../policies/weather-station.js');

/* GET All weather data */
router.get('/', auth, function(req, res, next) {
    req.app.models.weatherdata.find().exec(function(err, models) {
        if(err) return next(err);
        res.json(models);
    });
});

/* POST Weather data: publish a weather data */
router.post('/', isWeatherStation, function(req, res, next) {
    req.app.models.weatherdata.create({
        temperature: req.body.temperature, 
        temperature2: req.body.temperature2, 
        humidity: req.body.humidity, 
        heat_index: req.body.heat_index, 
        ip: req.ip
    }, function(err, model) {
        if(err) return next(err);
        res.json(model);
    });
});

/* GET Weather data */
router.get('/:id', auth, function(req, res, next) {
    req.app.models.weatherdata.findOne({ id: req.params.id }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        res.json(model);
    });
});

module.exports = router;
