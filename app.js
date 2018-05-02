var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('./apiai_recognizer');

//create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassWord: process.env.MICROSOFT_APP_PASSWORD
});

//create memory storage
var inMemoryStorage = new builder.MemoryBotStorage();

//receive messages from the user and respond
const bot = new builder.UniversalBot(connector,{
	// persistConversationData: true
})    
	.set('storage', inMemoryStorage);;

//create custom intent reconizer
bot.recognizer({
	recognize: function (context, done) {
	var intent = { score: 0.0 };
	
			if (context.message.text) {
				switch (context.message.text.toLowerCase()) {
					case 'help':
						intent = { score: 1.0, intent: 'Help' };
						break;
					case 'goodbye':
						intent = { score: 1.0, intent: 'Goodbye' };
						break;
				}
			}
			done(null, intent);
		}
	});	

//setup restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
	console.log('%s listening to %s', server.name, server.url);
});

//listen for message from users
server.post('/api/messages', connector.listen());

intents.matches('Intent.Greeting','/intent.greeting');
intents.matches('Intent.Flattery', '/intent.flattery');
intents.matches('Intent.Get_Pic','/intent.get_pic');
intents.matches('Intent.Service_Inquiry','/intent.service_inquiry');
intents.matches('Intent.Price_Inquiry','/intent.price_inquiry');
intents.matches('Intent.Availability', '/intent.availability');
intents.matches('Intent.Transportation_Inquiry','/intent.transportation_inquiry');
intents.matches('Intent.Location_Inquiry','/intent.location_inquiry');
intents.matches('Intent.Give_Location','/intent.give_location');
intents.matches('Intent.Give_TimeSlot','/intent.give_timeslot');

bot.dialog('/', intents);

var askName = require('./askName.js');
bot.dialog('askName', askName.askName);

var saveDialogData = function (session, args, next){
	session.userData.profile = args.response;
	session.endDialog();
};

//intent_handler: /intent.greeting
bot.dialog('/intent.greeting', [
	function(session, args, next){
		session.userData.profile = session.userData.profile || {};
		var entities = args.entities;
		if(!session.userData.profile.name){
			session.userData.profile.name = getName(entities);
		}
		var name = session.userData.profile.name || 'sweetie';
		var reply = `Hey there, ${name}.`;
		if(!session.userData.profile.name){
			var data = {profile: session.userData.profile, reply: reply};
			session.beginDialog('askName', data);
		}
		else{
			session.endDialog(reply);
		}
	},
	saveDialogData
]);

//intent_handler: /intent.flattery
bot.dialog('/intent.flattery', [
	function(session, args, next){
		session.userData.profile = session.userData.profile || {};
		var entities = args.entities;
		if(!session.userData.profile.name){
			session.userData.profile.name = getName(entities);
		}
		var name = session.userData.profile.name || '';
		var reply = `I'm not saying flattery won't get you anywhere, but I'm not saying it will.`;
		if(!session.userData.profile.name){
			var data = {profile: session.userData.profile, reply: reply};
			session.beginDialog('askName', data);
		}
		else{
			session.endDialog(reply);
		}
	},
	saveDialogData	
]);

//intent_handler: /intent.get_pic
bot.dialog('/intent.get_pic', [
	function(session, args, next){
		session.userData.profile = session.userData.profile || {};
		var entities = args.entities;
		if(!session.userData.profile.name){
			session.userData.profile.name = getName(entities);
		}
		var name = session.userData.profile.name || '';
		var reply = `I'll show you mine if you show me yours.`;
		if(!session.userData.profile.name){
			var data = {profile: session.userData.profile, reply: reply};
			session.beginDialog('askName', data);
		}
		else{
			session.endDialog(reply);
		}
	},
	saveDialogData		
]);

//intent_handler: /intent.service_inquiry


//intent_handler: /intent.price_inquiry
bot.dialog('/intent.price_inquiry', [
	function(session, args, next){
		session.userData.profile = session.userData.profile || {};
		var entities = args.entities;
		if(!session.userData.profile.name){
			session.userData.profile.name = getName(entities);
		}
		var name = session.userData.profile.name || '';
		var reply = `it's $50.`;
		if(!session.userData.profile.name){
			var data = {profile: session.userData.profile, reply: reply};
			session.beginDialog('askName', data);
		}
		else{
			session.endDialog(reply);
		}
	},
	saveDialogData		
]);

//intent_handler: /intent.availability
bot.dialog('/intent.availability', [
	function(session, args, next){
		session.userData.profile = session.userData.profile || {};
		var entities = args.entities;
		if(!session.userData.profile.name){
			session.userData.profile.name = getName(entities);
		}
		var name = session.userData.profile.name || '';
		if(name){
			name += ' ';
		}
		var reply = `Sry ${name}I'm pretty busy right now, but let's set something up later.`;
		if(!session.userData.profile.name){
			var data = {profile: session.userData.profile, reply: reply};
			session.beginDialog('askName', data);
		}
		else{
			session.endDialog(reply);
		}
	},
	saveDialogData		
]);

//intent_handler: /intent.availability
bot.dialog('/intent.give_timeslot', [
	function(session, args, next){
		session.userData.profile = session.userData.profile || {};
		var entities = args.entities;
		if(!session.userData.profile.name){
			session.userData.profile.name = getName(entities);
		}
		var name = session.userData.profile.name || '';
		var reply = `I'm pretty booked up then.  Mayb later.`;
		if(!session.userData.profile.name){
			var data = {profile: session.userData.profile, reply: reply};
			session.beginDialog('askName', data);
		}
		else{
			session.endDialog(reply);
		}
	},
	saveDialogData		
]);

//intent_handler: /intent.transportation
bot.dialog('/intent.transportation_inquiry', [
	function(session, args, next){
		session.userData.profile = session.userData.profile || {};
		var entities = args.entities;
		if(!session.userData.profile.name){
			session.userData.profile.name = getName(entities);
		}
		var name = session.userData.profile.name || '';
		var reply = `send your address. i'll uber.`;
		if(!session.userData.profile.name){
			var data = {profile: session.userData.profile, reply: reply};
			session.beginDialog('askName', data);
		}
		else{
			session.endDialog(reply);
		}
	},
	saveDialogData		
]);

//intent_handler: /intent.give_location
bot.dialog('/intent.give_location', [
	function(session, args, next){
		session.userData.profile = session.userData.profile || {};
		var entities = args.entities;
		if(!session.userData.profile.name){
			session.userData.profile.name = getName(entities);
		}
		var name = session.userData.profile.name || '';
		var reply = `send your address. i'll uber.`;
		if(!session.userData.profile.name){
			var data = {profile: session.userData.profile, reply: reply};
			session.beginDialog('askName', data);
		}
		else{
			session.endDialog(reply);
		}
	},
	saveDialogData			
]);

//intent_handler: /intent.location_inquiry
bot.dialog('/intent.location_inquiry', [
	function(session, args, next){
		session.userData.profile = session.userData.profile || {};
		var entities = args.entities;
		if(!session.userData.profile.name){
			session.userData.profile.name = getName(entities);
		}
		var name = session.userData.profile.name || '';
		var reply = `i got a place in buckhead tonight.`;
		if(!session.userData.profile.name){
			var data = {profile: session.userData.profile, reply: reply};
			session.beginDialog('askName', data);
		}
		else{
			session.endDialog(reply);
		}
	},
	saveDialogData		
]);


function getName(entities){
	if (entities.hasOwnProperty('entity-name')){
		return entities['entity-name'];
	}	
	else{
		return '';
	}
}

