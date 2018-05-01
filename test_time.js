var utils = require('./utils');

var initialProfile = {
	default: {
		model: 'Gina',
		neighborhood: 'Rome'
	},
	appointment: {
		'exact-time': [ {'time': '12:00:00'}],
		'relative-time': [{time: '03:00:00', 'time-relative': 'after'}],
		service: [],
		price: [],
		location: [],	
		model: ''
	},
	demographic: {
		name: ''
	},
	confirmation: {
		time: {
			hour: null, minute: null, date: ''
		},
		location: {
			neighborhood: '', site: '', address: ''
		},
		service: {
			'service-in-out': '', duration: '', addon: ''
		}
	}
};
var appt = initialProfile.appointment;
var apptExactTime = appt['exact-time'];
var apptRelativeTime = appt['relative-time'];

var exactTime = utils.getEntity('exact-time', appt['exact-time']);
var relativeTime = utils.getEntity('relative-time', appt['relative-time']);


var date = exactTime.date || null;
if (!date && !(exactTime['date-period'] || relativeTime['date'] || relativeTime['date-period'])) {
    date = 'today';
}
var time = exactTime.time || null;

var complete = (date && time) ? 1 : 0;

var result = {
    complete: complete,
    exactTime: exactTime,
    relativeTime: relativeTime
}
// var givenTime = utils.fillTime(apptExactTime, apptRelativeTime);
var givenTime = utils.fillTime(appt['exact-time'], appt['relative-time']);

console.log('%j', exactTime);
console.log('%j', relativeTime);
console.log('%j', result);
console.log('%j', givenTime);


var date_str = '2018-03-06';
var time_str = '16:00:00';
var now = new Date();
var date = new Date();
var dateEles = date_str.split('-').map(Number);
var timeEles = time_str.split(':').map(Number);
date.setHours(timeEles[0], timeEles[1], timeEles[2]);
date.setFullYear(dateEles[0], dateEles[1] - 1, dateEles[2]);

var dateDelta = (date - now)/1000/3600/24;

console.log('%j', dateEles);
console.log(dateDelta);
console.log(date.getHours());

initialProfile.confirmation.time.date = utils.parseDate('2018-04-08');
[initialProfile.confirmation.time.hour,
    initialProfile.confirmation.time.minute] = utils.parseTime(time_str);

console.log('%j', initialProfile);

// var test = [1, 2, 3];
// console.log(test.slice(0, 2));

var time = '07:00:00';
if (time && utils.isNow(time)) {
	console.log('Now');
}
else {
	console.log('Not Now');
}