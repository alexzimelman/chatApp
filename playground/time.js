// January 1st 1970 00:00:00 am

var moment = require('moment');

var timeStamp = moment().valueOf();
console.log(timeStamp);

var createdAt = 0;
var date = moment();
console.log(date.format('DD/MM/YYYY HH:mm'));
