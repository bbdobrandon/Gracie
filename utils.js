var saveDialogData = function (session, args, next){
	session.userData.profile = args.response;
	session.endDialog();
};
exports.saveDialogData = saveDialogData;

const availEntity = {
	Availability: ['exact-location', 'service', 'exact-time', 'relative-time', 'entity-name', 'self-reference'],
	Service: ['service', 'price', 'self-reference','entity-name'],
	Location: ['exact-location', 'service', 'exact-time', 'relative-time', 'self-reference','entity-name'],
	Price: ['service', 'self-reference','entity-name'],
	Greeting: ['entity-name', 'self-reference']
};

const entityDict = {
	'exact-location': 'location',
	'service': 'service',
	'exact-time': 'exact-time',
	'relative-time': 'relative-time',
	'price': 'price',
	'entity-name': 'name',
	'self-reference': 'modelName'
};

function fillProfile (session, intent, entities){
	availEntity[intent].forEach( (entity) => {
		if (entities.hasOwnProperty(entity) && entities[entity]){
			switch(entity) {
				case 'entity-name':
					session.userData.profile.demographic.name = entities[entity];
					break;
				case 'self-reference':
					session.userData.profile.appointment.model = entities[entity];
					break
				default:
					if (Array.isArray(entities[entity])) {
						entities[entity].forEach((ele) => {
							session.userData.profile.appointment[entityDict[entity]].push(ele);		
						});
					}else {
						session.userData.profile.appointment[entityDict[entity]].push(entities[entity]);
					}
			}
		}
	});
}
exports.fillProfile = fillProfile;

const entityCategory = {
	'exact-time': ['date', 'time', 'time-period', 'date-period'],
	'relative-time': ['time-relative', 'date', 'time', 'time-period', 'date-period', 'duration'],
	service: ['service-in-out', 'service-duration', 'service-addon', 'service-cardate', 'service-booking'],
	location: ['atlanta-neighborhood']
};

function getEntity (entity_type, response) {
	var result = {};
	var category = entityCategory[entity_type];

	category.forEach( (sub) => {
		if (response.constructor == Array) {
			var find = response.find(o => o.hasOwnProperty(sub)) || '';
			if (find) {
				result[sub] = find[sub];
			}	
		}
		else {
			if (response.hasOwnProperty(sub)) {
				result[sub] = response[sub];
			}
		}
	});
	return result;
}
exports.getEntity = getEntity;

function fillTime (apptExactTime, apptRelativeTime) {
	var exactTime = {};
	var relativeTime = {}
	if (apptExactTime) {
		exactTime = getEntity('exact-time', apptExactTime) || exactTime;
	}

	if (apptRelativeTime) {
		relativeTime = getEntity('relative-time', apptRelativeTime) || relativeTime;
	}

	var date = exactTime.date || null;
	if (!date && !(exactTime['date-period'] || relativeTime['date'] || relativeTime['date-period']) 
		&& (exactTime.time || exactTime['time-period'] || relativeTime['time'] || relativeTime['time-period'] || relativeTime['duration'])) {
		date = 'today';
	}

	var time = exactTime.time || null;
	if (time && isNow(time)) {
		time = 'now';
	}

	var complete = (date && time && time != 'now') ? 1 : 0;
	
	var result = {
		complete: complete,
		date: date,
		time: time,
		exactTime: exactTime,
		relativeTime: relativeTime
	}
	return result;
}
exports.fillTime = fillTime;

const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
function parseDate (date_str) {
	var date_parsed = 'today';
	var now = new Date();
	var date = new Date();

	if (date_str == 'today') {
		return date_str;
	}
	else {
		var dateEles = date_str.split('-').map(Number);
		date.setFullYear(dateEles[0], dateEles[1] - 1, dateEles[2]);
		var dateDelta = (date - now)/1000/3600/24;
	
		if (dateDelta >1 && dateDelta < 2) {
			date_parsed = 'tomorrow';
		}
		else {
			date_parsed = weekday[date.getDay()];
			if ((dateDelta >= 7 && dateDelta < 14) || dateDelta < 0) {
				date_parsed = 'next ' + date_parsed;
			}
			else {
				date_parsed = month[dateEles[1]-1] + ' ' + dateEles[2];
			}
		}
		return date_parsed;	
	}
}
exports.parseDate = parseDate;

function parseTime (time_str) {
	var timeEles = time_str.split(':').map(Number);
	timeEles = timeEles.slice(0, 2);
	timeEles[0]  = timeEles[0] > 12 ? timeEles[0] - 12 : timeEles[0];
	return timeEles;
}
exports.parseTime = parseTime;

function isNow (time_str) {
	var now = new Date();
	var time = new Date();
	var timeEles = time_str.split(':').map(Number);
	time.setHours(timeEles[0], timeEles[1], timeEles[2]);
	if (time - now < 300000 && time - now > 0) {
		return true;
	}
	else {
		return false;
	}
}
exports.isNow = isNow;

const priceTable = {
	'15min': '$50',
	'30min': '$100',
	'1 hour': '$200',
	'2 hour': '$400',
	'overnight': '$1500'
};
exports.priceTable = priceTable;