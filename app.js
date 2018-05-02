//thought: leave price list on backpage; (maybe) ask client to leave name&phone;
//[delete]cat mario[delete]
var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('./apiai_recognizer');
var utils = require('./utils');

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

//setup restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
	console.log('%s listening to %s', server.name, server.url);
});

//listen for message from users
server.post('/api/messages', connector.listen());

//Main Dialog
// bot.recognizer(apiai.recognizer);
//Begin Dialog Opener
bot.dialog('/', [
	function (session, args, next){
		session.send('[Start Root Dialog]');
		session.userData.profile = session.userData.profile || initialProfile;
		session.beginDialog('opener:/');
	},
	function (session, args, next){
		// session.beginDialog('main:/');
		session.send('[Start Main Dialog]');
	}
]);

bot.library(require('./opener').createLibrary());
bot.library(require('./askName').createLibrary());
bot.library(require('./confirmTime').createLibrary());

const initialProfile = {
	default: {
		model: 'Gina',
		neighborhood: 'Rome'
	},
	appointment: {
		'exact-time': [],
		'relative-time': [],
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
			hour: null, minute: null, date: null
		},
		location: {
			neighborhood: '', site: '', address: ''
		},
		service: {
			'service-in-out': '', duration: '', addon: ''
		}
	}
};