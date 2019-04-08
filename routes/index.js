var express = require('express');
var requestIp = require('request-ip');
var passport = require('passport');
var router = express.Router();
var auth = require('../policies/auth.js');

/* GET home page */
router.get('/', function (req, res, next) {
    if (req.app.get('configurated')) {
        if (!req.isAuthenticated()) {
            res.redirect('/login');
        } else {
            res.render('index');
        }
    } else {
        req.app.models.users.find().exec(function (err, models) {
            if (err) return next(err);
            if (models.length == 0) {
                res.redirect('/users/new');
            } else if (!req.isAuthenticated()) {
                res.redirect('/login');
            } else {
                res.render('index');
            }
        });
    }
});

/* GET login page */
router.get('/login', function (req, res) {
    res.locals.message = req.flash('message');
    res.render('login');
});

/* GET login */
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    res.redirect('/');
});

/* GET logout */
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

/* GET users: get all users */
router.get('/users', auth, function (req, res) {
    req.app.models.users.find().exec(function (err, models) {
        if (err) return next(err);
        res.locals.users = models;
        res.render('users-list');
    });
});

/* GET new user: create new account */
router.get('/users/new', auth, function (req, res) {
    req.app.models.users.find().exec(function (err, models) {
        if (err) return next(err);
        res.locals.connected = (models.length == 0);
        res.render('new-account');
    });
});

/* GET delete user: delete an user with email */
router.get('/users/delete/email/:email', auth, function (req, res) {
    if (req.user.email == req.params.email) {
        res.locals.success = 'user-not-deleted';
        res.render('success-page');
    } else {
        req.app.models.users.destroy({ email: req.params.email }, function (err) {
            if (err) return next(err);
            res.locals.success = 'user-deleted';
            res.render('success-page');
        });
    }
});

/* GET delete user: delete an user with id */
router.get('/users/delete/id/:id', auth, function (req, res) {
    if (req.user.id == req.params.id) {
        res.locals.success = 'user-not-deleted';
        res.render('success-page');
    } else {
        req.app.models.users.destroy({ id: req.params.id }, function (err) {
            if (err) return next(err);
            res.locals.success = 'user-deleted';
            res.render('success-page');
        });
    }
});

/* POST New user: save new user */
router.post('/users/new/', auth, function (req, res, next) {
    req.app.models.users.create(req.body, function (err, model) {
        if (err) return next(err);
        res.redirect('/login');
    });
});


/* GET IP: a tool to get the ip to use in the whitelist */
router.get('/ip', function (req, res, next) {
    var clientIp = requestIp.getClientIp(req);
    console.log('\x1b[36mThe address IP of the sensor is:\x1b[0m', clientIp);
    res.send(clientIp);
});


module.exports = router;
