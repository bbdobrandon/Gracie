var builder = require('botbuilder');
var apiai = require('./apiai_recognizer');
var utils = require('./utils');
var lib_router = require('./lib_router');

var lib = new builder.Library('opener');
lib.recognizer(apiai.recognizer);
//call routing the first message to sub opener diaglog
lib.dialog('/', function(session, args, next){
	session.send('[Start Opener Dialog]');   
	//should start with greeting with model name, later user cannot making excuse of texting wrong people
	lib_router.routeMessage(lib, session);
})
.beginDialogAction('openGreetingAction', '/intent.greeting', {matches: 'Intent.Greeting'})
.beginDialogAction('openAvailAction', '/intent.availability', {matches: 'Intent.Availability'})
.beginDialogAction('openServiceAction', '/intent.service_inquiry', {matches: 'Intent.Service_Inquiry'})
.beginDialogAction('openLocationAction', '/intent.location_inquiry', {matches: 'Intent.Location_Inquiry'})
.beginDialogAction('openPriceAction', '/intent.price_inquiry', {matches: 'Intent.Price_Inquiry'})
.cancelAction('cancelAction', '[Unindentified Intent, Directing to Main]', {matches: 'Default Fallback Intent'});


lib.dialog('/intent.greeting', [
	function(session, args, next ){
		session.send('[Start Greeting Dialog]');
		// session.send('%j', session.userData.profile);
		var entities = args.intent.entities;
		utils.fillProfile(session, 'Greeting', entities);
		// session.send('%j', session.userData.profile);
		
		var appt = session.userData.profile.appointment;
		var demo = session.userData.profile.demographic;

		var name = demo.name || 'sweetie';
		var reply = `Hey there, ${name}.`;

		if (!appt.model) {
			session.userData.profile.appointment.model = session.userData.profile.default.model;
			appt.model = session.userData.profile.default.model;
		}
		reply += ` ${appt.model} here.`

		if (!demo.name) {
			var data = {profile: session.userData.profile, reply: reply+' btw'};
			session.beginDialog('askName:/', data);
		}
		else {
			session.endDialog(reply);
		}
	},
	function(session, args, next) {
		session.userData.profile.demographic.name = args.response;
		session.endDialog();
	}
]);


lib.dialog('/intent.availability', [
	function(session, args, next){
        session.send('[Start Availability Dialog]');
		var entities = args.intent.entities;
		utils.fillProfile(session, 'Availability', entities);
		session.send('%j', session.userData.profile);		
		var appt = session.userData.profile.appointment;
		var demo = session.userData.profile.demographic;

		if (!appt.model) {
			session.userData.profile.appointment.model = session.userData.profile.default.model;
			appt.model = session.userData.profile.default.model;
		}
		var msg = `Hi ${appt.model} here. available and can't wait to meet u`;
		msg += demo.name ? ' ' + demo.name : '';
		session.send(msg);

		if (!demo.name) {
			var data = {profile: session.userData.profile, reply: ''};
			session.beginDialog('askName:/', data);
		}
		else {
			next()
		}
	},
	function (session, args, next) {
		session.userData.profile.demographic.name = args.response;
		var appt = session.userData.profile.appointment;
		var demo = session.userData.profile.demographic;	
		
		var reply = '';
		if (appt.service) {
			// session.send('%j', appt.service);
			var apptService = utils.getEntity('service', appt.service);
			// session.send('%j', apptService);
			reply += apptService['service-in-out'] ? apptService['service-in-out'] : '';
			reply += (reply ? ', ' : '') + apptService['duration'] ? apptService['duration'] : '';
			reply += (reply ? ', ' : '') + apptService['addon'] ? apptService['addon'] : '';
					
			if (reply) {
				reply += '? sure I can do that.';
			}
			session.userData.profile.confirmation.service = apptService;
		}

		if (appt.location) {
			// session.send('%j', appt.location);
			var apptLocation = utils.getEntity('location', appt.location);
			if (apptLocation['atlanta-neighborhood']) {
				reply += ` in ${apptLocation['atlanta-neighborhood']} right now.`
			}	
			session.userData.profile.confirmation.location.neightborhood = apptLocation['atlanta-neighborhood'];
		}

		if (reply) {
			session.send(reply);
		}

		var givenTime = utils.fillTime(appt['exact-time'], appt['relative-time']);
		if (givenTime.complete) {
			reply = (reply ? 'And' : '') + `my schedule is open at that time.`
			session.userData.profile.confirmation.time.date = utils.parseDate(givenTime.date);	
				[session.userData.profile.confirmation.time.hour,
					session.userData.profile.confirmation.time.minute] = utils.parseDate(givenTime.time);					
			session.endDialogWithResult({reply: reply, data: {date: givenTime.date, time: givenTime.time}});
		}
		else {
			session.beginDialog('confirmTime:/', {data: givenTime, reprompt: 0});
		}
	},
	function (session, args, next) {
		session.endDialog();
	}
]);

lib.dialog('/intent.service_inquiry', [
	function(session, args, next){		
		session.send('[Start Service Inquiry Dialog]');
		var entities = args.intent.entities;
		utils.fillProfile(session, 'Service', entities);
		session.send('%j', session.userData.profile);		
		var appt = session.userData.profile.appointment;
		var demo = session.userData.profile.demographic;
		
		if (!appt.model) {
			session.userData.profile.appointment.model = session.userData.profile.default.model;
			appt.model = session.userData.profile.default.model;
		}		
		session.send(`Hi ${appt.model} here.`);
		if (!demo.name) {
			var data = {profile: session.userData.profile, reply: ' First'};
			session.beginDialog('askName:/', data);
		}
		else {
			next();
		}
	},
	function (session, args, next){		
		session.userData.profile.demographic.name = args.response;
		var appt = session.userData.profile.appointment;
		var demo = session.userData.profile.demographic;			
		var apptService = utils.getEntity('service', appt.service);
		
		var has_inout = 0;
		var has_duration = 0;
		var has_addon = 0;

		var confirm_inout = '';
		var duration = '';
		var addon = '';

		if (apptService['service-in-out']) {
			has_inout = 1;
			confirm_intout = apptService['service-in-out'];
		}

		if (apptService['service-duration']) {
			has_duration = 1;
			duration = apptService['service-duration'];
		}

		if (apptService['service-addon']) {
			has_addon = 1;
			addon = 1;
		}

		if (apptService['service-cardate']) {
			has_inout = 1;
			has_duration = 1;
			confirm_inout = 'outcall';
			duration = '15min';
		}

		if (has_inout && !has_duration) {
			session.endDialog('how long are you looking for?');
		}
		else if (!has_inout) {
			session.endDialog('Incall or outcall?');
		}
		else {
			session.endDialog('both in-out and duration accquired. switch to main dialog');
		}
	}
]);

lib.dialog('/intent.location_inquiry', [
	function(session, args, next){
		session.send('[Start Location Inquiry Dialog]');
		var entities = args.intent.entities;
		utils.fillProfile(session, 'Location', entities);
		session.send('%j', session.userData.profile);		
		var appt = session.userData.profile.appointment;
		var demo = session.userData.profile.demographic;	
		
		if (!appt.model) {
			session.userData.profile.appointment.model = session.userData.profile.default.model;
			appt.model = session.userData.profile.default.model;
		}			
		session.send(`Hi ${appt.model} here.`);

		if (!demo.name) {
			var data = {profile: session.userData.profile, reply: ' First'};
			session.beginDialog('askName:/', data);
		}
		else {
			next();
		}
	},
	function (session, args, next){		
		session.userData.profile.demographic.name = args.response;
		var appt = session.userData.profile.appointment;
		var demo = session.userData.profile.demographic;			

		var apptLocation = utils.getEntity('location', appt.location);
	
		//if no neighborhood is available, use default
		if (apptLocation['atlanta-neighborhood']) {
			var reply = `Yeah i'm in ${apptLocation['atlanta-neighborhood']} rn, and have some open slots;`;
		}
		else {
			apptLocation['atlanta-neighborhood'] = session.userData.profile.default.neighborhood;
			var reply = `i'm in ${apptLocation['atlanta-neighborhood']}, have some open slots`;
		}
		session.endDialog(reply);
	}
]);

lib.dialog('/intent.price_inquiry', [
	function(session, args, next){
		session.send('[Start Price Inquiry Dialog]');
		var entities = args.intent.entities;
		utils.fillProfile(session, 'Price', entities);
		session.send('%j', session.userData.profile);			

		var appt = session.userData.profile.appointment;
		var demo = session.userData.profile.demographic;	
		
		if (!appt.model) {
			session.userData.profile.appointment.model = session.userData.profile.default.model;
			appt.model = session.userData.profile.default.model;
		}			
		session.send(`Hi ${appt.model} here.`);

		var apptService = utils.getEntity('service', appt.service);
		var reply = '';
		if (apptService['service-duration']) {
			var price = utils.priceTable[apptService['service-duration']];
			reply += `${apptService['service-duration']} is ${price}`;
		}
		if (apptService['service-in-out'] && apptService['service-in-out']=='outcall') {
			reply += (reply ? ' and ': '') + 'outcall is 5% upcharge';
		}

		if (!reply) {
			var price = utils.priceTable['1 hour'];
			reply += `${price} for an hour`;
		}
		reply += ". there's a price list on my page, feel free to check it out.";
		session.send(reply);
		next();
	},
	function(session, args, next) {
		var appt = session.userData.profile.appointment;
		var demo = session.userData.profile.demographic;			

		if (!demo.name) {
			var data = {profile: session.userData.profile, reply: ' also'};
			session.beginDialog('askName:/', data);
		}
		else {
			session.endDialog();
		}
	},
	function(session, args, next) {
		session.userData.profile.demographic.name = args.response;
		session.endDialog();
	}	
]);

module.exports.createLibrary = function(){
    return lib.clone();
};

