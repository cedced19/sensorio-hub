var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');
var isElectricMeter = require('../policies/electric-meter.js');
var async = require('async');

/* GET last electric data from each sensor */
router.get('/', auth, function (req, res, next) {
    req.app.models.electricdata.find({
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


/* GET electric data from one electric meter from last 24 hours  */
router.get('/:ip/day', auth, function (req, res, next) {
    req.app.models.electricdata.find({
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

/* GET electric data from one electric meter from last 7 days */
router.get('/:ip/week', auth, function (req, res, next) {
    req.app.models.electricdata.find({
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

/* POST Electric data: publish a electric data */
router.post('/', isElectricMeter, function (req, res, next) {
    req.body.ip = req.ip;
    req.app.models.electricdata.create(req.body, function (err, model) {
        if (err) return next(err);
        res.json(model);
    });
});

/* GET Electric data */
router.get('/:ip', auth, function (req, res, next) {
    req.app.models.electricdata.findOne({ ip: req.params.ip }, function (err, model) {
        if (err) return next(err);
        if (model === '' || model === null || model === undefined) return next(err);
        res.json(model);
    });
});


/* DELETE All electric data from one ip  */
router.delete('/:ip', auth, function (req, res, next) {
    req.app.models.electricdata.find({
        ip: req.params.ip
    }).exec(function (err, models) {
        if (err) return next(err);
        async.each(models, function(model, callback) {
            req.app.models.electricdata.destroy({ id: model.id }, callback);
        }, function(err) {
            if (err) next(err);
            res.json(models);
        });
    });
});


module.exports = router;
