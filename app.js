var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var i18n = require('i18n-express');

var compress = require('compression');
var minifyTemplate = require('express-beautify').minify;

var passport = require('passport');
var hash = require('password-hash-and-salt');
var flash = require('connect-flash');
var helmet = require('helmet');
var session = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(session);
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var users = require('./routes/users-api');
var sensors = require('./routes/sensors-api');
var weatherData = require('./routes/weather-data-api');
var electricData = require('./routes/electric-data-api');
var fillRateCylinderValue = require('./routes/fill-rate-cylinder-sensor-api');
var forceTasks = require('./routes/force-tasks-api');
var version = require('./routes/version-api');
var index = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(i18n({
    translationsPath: path.join(__dirname, 'i18n'),
    cookieLangName: 'language',
    paramLangName: 'lang',
    siteLangs: ['en','fr']
}));  

app.use(compress());

if (app.get('env') === 'development') {
    app.use(logger('dev'));
} else {
    app.use(compress());
    app.use(minifyTemplate());
}
  

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(flash());
app.use(session({
    secret: 'centralize sensor data',
    name: 'sensorio-hub-session',
    proxy: false,
    resave: true,
    saveUninitialized: true,
    store: new MongoDBStore({
        uri: 'mongodb://localhost:27017/sensorio',
        collection: 'sessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/api/users', users);
app.use('/api/sensors', sensors);
app.use('/api/weather-data', weatherData);
app.use('/api/electric-data', electricData);
app.use('/api/fill-rate-cylinder-value', fillRateCylinderValue);
app.use('/api/force-tasks', forceTasks);
app.use('/api/version', version);

// authentication
passport.serializeUser(function (model, done) {
    done(null, model.email);
});

passport.deserializeUser(function (email, done) {
    app.models.users.findOne({ email: email }, function (err, model) {
        delete model.password;
        done(err, model);
    });
});

// define local strategy
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    // search in database
    app.models.users.findOne({ email: email }, function (err, model) {
        if (err) { return done(err); }
        if (!model) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        // test password
        hash(password).verifyAgainst(model.password, function (err, verified) {
            if (err || !verified) {
                return done(null, false, {
                    message: 'Invalid password.'
                });
            } else {
                var returnmodel = {
                    email: model.email
                };
                return done(null, returnmodel, {
                    message: 'Logged in successfully.'
                });
            }
        });
    });
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;