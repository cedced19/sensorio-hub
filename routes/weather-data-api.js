var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');
var isWeatherStation = require('../policies/weather-station.js');

/* GET last weather data from each station */
router.get('/', auth, function (req, res, next) {
    req.app.models.weatherdata.find({
        createdAt: { '>=': new Date(new Date().getTime() - 60 * 60 * 1000) },
        sort: { createdAt: 'desc' }
    }).exec(function (err, models) {
        if (err) return next(err);
        var lastData = [];
        var ips = [];
        for (var k in models) {
            if (!ips.includes(models[k].ip)) {
                lastData.push(models[k]);
                ips.push(models[k].ip);
            }
        }
        res.json(lastData);
    });
});


/* GET weather data from one station from last 24 hours  */
router.get('/:ip/day', auth, function (req, res, next) {
    req.app.models.weatherdata.find({
        createdAt: { '>=': new Date(new Date().getTime() - 60 * 60 * 1000 * 24) },
        sort: { createdAt: 'desc' },
        ip: req.params.ip
    }).exec(function (err, models) {
        if (err) return next(err);
        models.forEach(function (model) {
            delete model.ip;
        });
        res.json(models);
    });
});

/* GET weather data from one station from last 7 days */
router.get('/:ip/week', auth, function (req, res, next) {
    req.app.models.weatherdata.find({
        createdAt: { '>=': new Date(new Date().getTime() - 60 * 60 * 1000 * 24 * 7) },
        sort: { createdAt: 'desc' },
        ip: req.params.ip
    }).exec(function (err, models) {
        if (err) return next(err);
        models.forEach(function (model) {
            delete model.ip;
        });
        res.json(models);
    });
});

/* POST Weather data: publish a weather data */
router.post('/', isWeatherStation, function (req, res, next) {
    if (req.body.temperature2 === 'false') {
        delete req.body.temperature2;
    }
    req.body.ip = req.ip;
    req.app.models.weatherdata.create(req.body, function (err, model) {
        if (err) return next(err);
        res.json(model);
    });
});

/* GET Weather data */
router.get('/:ip', auth, function (req, res, next) {
    req.app.models.weatherdata.findOne({ ip: req.params.ip }, function (err, model) {
        if (err) return next(err);
        if (model === '' || model === null || model === undefined) return next(err);
        res.json(model);
    });
});

/* GET Weather data for a displayer */
router.get('/:ip/displayer', function (req, res, next) {
    req.app.models.weatherdata.find({
        ip: req.params.ip,
        sort: { createdAt: 'desc' },
    }).exec(function (err, model) {
        if (err) return next(err);
        if (model === null || model === undefined || model.length === 0) return next(err);
        res.json({humidity: model[0].humidity, temperature: model[0].temperature});
    });
});


module.exports = router;
