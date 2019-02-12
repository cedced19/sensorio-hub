var express = require('express');
var router = express.Router();
var moment = require('moment');
var async = require('async');
var auth = require('../policies/auth.js');
var sendDailyMail = require('../tasks/send-daily-mail');
var sendMonthlyMail = require('../tasks/send-monthly-mail');

function prepareData(req, range, cb) {
    async.parallel([
        function (callback) {
            callback(null, [req.user]);
        },
        function (callback) {
            req.app.models.weatherdata.find({
                createdAt: { '>=': new Date(new Date().getTime() - range) },
                sort: { createdAt: 'desc' }
            }).exec(function (err, models) {
                if (err) return callback(true);
                callback(null, models);
            });
        },
        function (callback) {
          req.app.models.electricdata.find({
            createdAt: { '>=': new Date(new Date().getTime() - range) },
            sort: { createdAt: 'desc' }
          }).exec(function (err, models) {
            if (err) return callback(true);
            callback(null, models);
          });
        },
        function (callback) {
            req.app.models.sensors.find().exec(function (err, models) {
                if (err) return callback(true);
                callback(null, models);
            });
        }
    ], cb);
}

/* GET Monthly Mail */
router.get('/monthly-mail', auth, function (req, res, next) {
    prepareData(req, 86400000 * 31, function (err, results) {
        if (err) return next(err);
        sendMonthlyMail(...results, function (err) {
            if (err) return next(err);
            res.json({ status: true });
        });
    });
});

/* GET Daily Mail */
router.get('/daily-mail', auth, function (req, res, next) {
    prepareData(req, 86400000, function (err, results) {
        if (err) return next(err);
        sendDailyMail(...results, function (err) {
            if (err) return next(err);
            res.json({ status: true });
        });
    });
});

module.exports = router;
