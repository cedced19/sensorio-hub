
var getExtremum = function (data, value) {
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    for (var i=data.length-1; i>=0; i--) {
        tmp = data[i][value];
        if (tmp < lowest) {
            lowest = tmp;
            lowestKey = i;
        } 
        if (tmp > highest) {
            highest = tmp;
            highestKey = i;
        } 
    }
    return { highest: data[highestKey], lowest: data[lowestKey] };
}

module.exports = function (users, weatherData, sensors) {
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
    sensors.forEach(function (el) {
        el.extremum = getExtremum(el.data, 'temperature');
    });
};