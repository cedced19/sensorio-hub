var translation = require('../i18n/' + process.env.MAIL_LANGUAGE + '.json');
var getExtremums = require('get-extremums');
var getAverageProperty = require('get-average-property');
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

function groupBy(array, funcProp) {
    return array.reduce(function (acc, val) {
        (acc[funcProp(val)] = acc[funcProp(val)] || []).push(val);
        return acc;
    }, {});
};

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
    var title = `${moment().subtract(1, 'month').format('DD MMMM')} ${translation['TO']} ${moment().format('DD MMMM')}`;
    var text = `<h1>${translation['LAST_MONTH']}: ${title}</h1><i>${translation['GENERATED_AT']}: ${moment().format('DD/MM/YY HH:mm')}</i>`;

    sensors.forEach(function (el) {
        if (el.data.length == 0) {
            text += `<p>${translation['INACTIVE_SENSOR']}</p>`
        } else {
            // Divide data by days
            var days = groupBy(el.data, function (k) {
                return moment(new Date(k.createdAt)).startOf('day').format();
            });

            var daysStats = [];
            for (var k in days) {
                let extremums = getExtremums(days[k], 'temperature');
                daysStats.push({
                    lowest: extremums.lowest.temperature,
                    highest: extremums.highest.temperature,
                    average_temp: getAverageProperty(days[k], 'temperature'),
                    date: k
                });
            }
            // Get hottest and coldest day of the month
            var coldestAndHottestDays = getExtremums(daysStats, 'average_temp');

            // Get lowest and highest temperatures
            var lowestTempMonth = getExtremums(daysStats, 'lowest').lowest;
            var highestTempMonth = getExtremums(daysStats, 'highest').highest;
            text += `<h2>${el.name}</h2>
            <p>
                <ul>
                    <li>${translation['AVERAGE_LOWEST_TEMP']}: ${Math.floor(getAverageProperty(daysStats, 'lowest'))} °C</li>
                    <li>${translation['AVERAGE_HIGHEST_TEMP']}: ${Math.floor(getAverageProperty(daysStats, 'highest'))} °C</li>  
                    <li>${translation['LOWEST_TEMP_MONTH']} (<i>${moment(new Date(lowestTempMonth.date)).format('DD MMMM')}</i>): ${lowestTempMonth.lowest} °C</li>          
                    <li>${translation['HIGHEST_TEMP_MONTH']} (<i>${moment(new Date(highestTempMonth.date)).format('DD MMMM')}</i>): ${highestTempMonth.highest} °C</li>          
                    <li>${translation['COLDEST_DAY_MONTH']}: ${moment(new Date(coldestAndHottestDays.lowest.date)).format('DD MMMM')}</li>
                    <li>${translation['HOTTEST_DAY_MONTH']}: ${moment(new Date(coldestAndHottestDays.highest.date)).format('DD MMMM')}</li>           
                </ul>
            </p>`
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
        subject: 'Sensorio: ' + title, // The data is supposed to be runned at the first day of the month therefore it will be the data from last month
        html: text
    }, function (err) {
        if (cb) {
            cb(err);
        }
    });
};