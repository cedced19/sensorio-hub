var translation = require('../i18n/' + process.env.MAIL_LANGUAGE + '.json');
var getExtremums = require('get-extremums');
var nodemailer = require('nodemailer');
var moment = require('moment');
moment.locale(process.env.MAIL_LANGUAGE);

var transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS
    }
});


module.exports = function (users, weatherData, sensors, cb) {

    // Attach weather data to sensors
    var list = [];
    sensors.forEach(function (el) {
        el.data = [];
        list.push(el.ip);
    });
    weatherData.forEach(function (el) {
        var ip = el.ip;
        delete el.ip;
        sensors[list.indexOf(ip)].data.push(el);
    });

    // Generate text
    var text = `<h1>${translation['LAST_24_HOURS']}</h1><i>${translation['GENERATED_AT']}: ${moment().format('DD/MM/YY HH:mm')}</i>`;
    sensors.forEach(function (el) {
        text += `<h2>${el.name}</h2>`;
        if (el.data.length == 0) {
            text += `<p>${translation['INACTIVE_SENSOR']}</p>`
        } else {
        el.extremum = getExtremums(el.data, 'temperature');
        text += `<p>
            <b>${translation['HOTTEST_PERIOD']}</b>
            <i>${moment(new Date(el.extremum.highest.createdAt)).format('HH:mm')}</i>
            <ul>
                <li>${translation['TEMPERATURE']}: ${el.extremum.highest.temperature}°C</li>
                <li>${translation['HEAT_INDEX']}: ${el.extremum.highest.heat_index}°C</li>
                <li>${translation['HUMIDITY']}: ${el.extremum.highest.humidity}%</li>
                ${(el.extremum.highest.temperature2) ?`<li>${translation['TEMPERATURE']} n°2: ${el.extremum.highest.temperature2}°C</li>`: ''}
            </ul>
        </p>
        <p>
            <b>${translation['COLDEST_PERIOD']}</b>
            <i>${moment(new Date(el.extremum.lowest.createdAt)).format('HH:mm')}</i>
            <ul>
                <li>${translation['TEMPERATURE']}: ${el.extremum.lowest.temperature}°C</li>
                <li>${translation['HEAT_INDEX']}: ${el.extremum.lowest.heat_index}°C</li>
                <li>${translation['HUMIDITY']}: ${el.extremum.lowest.humidity}%</li>
                ${(el.extremum.lowest.temperature2) ? `<li>${translation['TEMPERATURE']} n°2: ${el.extremum.lowest.temperature2}°C</li>`: ''}
            </ul>
        </p>`;
        }
        
    });

    // Get receivers list
    var receivers = [];
    users.forEach(function (el) {
        receivers.push(el.email);
    });

    // Send mail
    transporter.sendMail({
        from: `Sensorio <${process.env.MAIL_AUTH_USER}>`,
        to: receivers.join(),
        subject: 'Sensorio: ' + moment().format('DD MMMM YYYY'),
        html: text
    }, function (err) {
        if (cb) {
            cb(err);
        }
    });
};