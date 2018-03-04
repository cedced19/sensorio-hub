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
var getAverageProperty = require('get-average-property');
var nodemailer = require('nodemailer');
var moment = require('moment');
moment.locale(mailConfig.language);

var transporter = nodemailer.createTransport({
    service: mailConfig.service,
    auth: mailConfig.auth
});

function groupBy(array, funcProp) {
    return array.reduce(function (acc, val) {
        (acc[funcProp(val)] = acc[funcProp(val)] || []).push(val);
        return acc;
    }, {});
};

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
    var text = `<h1>${translation['LAST_MONTH']}: ${moment().subtract(1, 'month').format('MMMM')}</h1><i>${translation['GENERATED_AT']}: ${moment().format('DD/MM/YY HH:mm')}</i>`;

    sensors.forEach(function (el) {
        // Divide data by days
        var days = groupBy(el.data, function (k) {
            return moment(new Date(k.createdAt)).startOf('day').format();
        });
        // Get extremums of each days
        var daysExtremums = [];
        for (var k in days) {
            let extremums = getExtremums(days[k], 'temperature');
            daysExtremums.push({
                lowest: extremums.lowest.temperature,
                highest: extremums.highest.temperature,
                date: k
            });
        }
        var lowestTempMonth = getExtremums(daysExtremums, 'lowest').lowest;
        var highestTempMonth = getExtremums(daysExtremums, 'highest').highest;
        text += `<h2>${el.name}</h2>
        <p>
            <ul>
                <li>${translation['AVERAGE_LOWEST_TEMP']}: ${Math.floor(getAverageProperty(daysExtremums, 'lowest'))} °C</li>
                <li>${translation['AVERAGE_HIGHEST_TEMP']}: ${Math.floor(getAverageProperty(daysExtremums, 'highest'))} °C</li>  
                <li>${translation['LOWEST_TEMP_MONTH']} (<i>${moment(new Date (lowestTempMonth.date)).format('DD MMMM')}</i>): ${lowestTempMonth.lowest} °C</li>          
                <li>${translation['HIGHEST_TEMP_MONTH']} (<i>${moment(new Date (highestTempMonth.date)).format('DD MMMM')}</i>): ${highestTempMonth.highest} °C</li>          
            </ul>
        </p>`
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
        subject: 'Sensorio: ' + moment().subtract(1, 'month').format('MMMM YYYY'), // The data is supposed to be runned at the first day of the month therefore it will be the data from last month
        html: text
    });
};