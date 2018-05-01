var restify = require('restify');
var builder = require('botbuilder');
// var apiai = require('apiai');
// var app = apiai("770a544a3c7545d191888148eba35a24");

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log("%s listening to %s", server.name, server.url)
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassWord: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/order-your-dragon', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector, [
    function (session){
        session.beginDialog('greeting', session.userData.profile);
    },
    function (session, result){
        session.userData.profile = result.response;
        if(!session.userData.profile.orders){
            session.send("It seems that you don't have any current orders with us.");
            session.beginDialog('placeOrder', session.userData.profiles);
        }
    }
])
    .set('storage', inMemoryStorage);

var greetings = require('./greeting.js');
var order = require('./order.js')
bot.dialog('greeting', greetings.greeting);
bot.dialog('askName', greetings.askName);
bot.dialog('placeOrder', order.askNewOrder);