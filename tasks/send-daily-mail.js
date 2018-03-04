var mailConfig = [];
var translation = {};
try {
    mailConfig = require('../mail-config.json');
    translation = require('../i18n/' + mailConfig.language + '.json');
} catch (e) {
    throw e;
    process.exit(1);
}

var getExtremums = require('get-extremums');
var nodemailer = require('nodemailer');
var moment = require('moment');
moment.locale(mailConfig.language);

var transporter = nodemailer.createTransport({
    service: mailConfig.service,
    auth: mailConfig.auth
});


module.exports = function (users, weatherData, sensors) {

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
        el.extremum = getExtremums(el.data, 'temperature');
        text += `<h2>${el.name}</h2>
        <p><b>${translation['HOTTEST_PERIOD']}</b>
        <i>${moment(new Date(el.extremum.highest.createdAt)).format('HH:mm')}</i>
        <ul>
            <li>${translation['TEMPERATURE']}: ${el.extremum.highest.temperature}°C</li>
            <li>${translation['HEAT_INDEX']}: ${el.extremum.highest.heat_index}°C</li>
            <li>${translation['HUMIDITY']}: ${el.extremum.highest.humidity}%</li>`;
        if (el.extremum.highest.temperature2) {
            text += `<li>${translation['TEMPERATURE']} n°2: ${el.extremum.highest.temperature2}°C</li>`
        }
        text += `</ul></p>
        <p><b>${translation['COLDEST_PERIOD']}</b>
        <i>${moment(new Date(el.extremum.lowest.createdAt)).format('HH:mm')}</i>
        <ul>
            <li>${translation['TEMPERATURE']}: ${el.extremum.lowest.temperature}°C</li>
            <li>${translation['HEAT_INDEX']}: ${el.extremum.lowest.heat_index}°C</li>
            <li>${translation['HUMIDITY']}: ${el.extremum.lowest.humidity}%</li>`;
        if (el.extremum.lowest.temperature2) {
            text += `<li>${translation['TEMPERATURE']} n°2: ${el.extremum.lowest.temperature2}°C</li>`
        }
        text += '</ul></p>';
    });
    
    // Get receivers list
    var receivers = [];
    users.forEach(function (el) {
        receivers.push(el.email);
    });

    // Send mail
    transporter.sendMail({
        from: `Sensorio <${mailConfig.auth.user}>`,
        to: receivers.join(),
        subject: 'Sensorio: ' + moment().format('DD MMMM YYYY'),
        html: text
    });
};