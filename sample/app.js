var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');

var app = apiai("174f14c7831e49cd9556f78791ae864c");

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log("%s listening to %s", server.name, server.url)
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassWord: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector,[
    function (session){
        session.send("Greetings, welcome to the Advanturer's Guild.");
        session.beginDialog('ensureProfile', session.userData.profile);
    },
    function (session, results){
        session.userData.profile = results.response;
        session.send(`${session.userData.profile.userclass} ${session.userData.profile.name}, anything i can do for you?`);
    }
])
    .set('storage', inMemoryStorage);
    
bot.dialog('ensureProfile', [
    function (session, args, next) {
        session.dialogData.profile = args || {};
        if (!session.dialogData.profile.name) {
            session.send("It's refreshing to see a new face. You need to register before you can accept task from the guild.");
            session.beginDialog('registerName');
        }
        else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
            session.send(`${session.dialogData.profile.name} is it? What a strange name.`);
            var request = app.textRequest(results.response, {
                sessionId: '1'
            });
            request.on('response', function(response) {
                session.send('%j', response);
            });
            
            request.on('error', function(error) {
                session.send('%j', response);
            });
            
            request.end();
        }
        if (!session.dialogData.profile.userclass) {
            session.beginDialog('registerClass');
        }
        else {
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.profile.userclass = results.response.entity;
            session.send(`${session.dialogData.profile.userclass} right? Done. Your registration is complete.`);
        }
        session.endDialogWithResult({ response: session.dialogData.profile});
    }
]);

bot.dialog('registerName', [
    function (session, args) {
        if (args && args.reprompt){
            builder.Prompts.text(session, "Now, may I have you name?", {
                retryPrompt: "Now, may I have your name?"
            });
        } else{
            builder.Prompts.text(session, "May I have you name?", {
                retryPrompt: "Now, may I have your name?"
            });
        }
    },
    function (session, results) {
        var name = results.response;
        if (typeof name == "string") {
            session.endDialogWithResult(results);
        } 
        else {
            session.replaceDialog('registerName', {reprompt: true});
        }
        
    }
]);

bot.dialog('registerClass', [
    function (session) {
        builder.Prompts.choice(session, "Which class you want to register? Tank, Healer or DPS?", ["Tank","Healer","DPS"], { 
            listStyle: 0,
            retryPrompt:  "Now, which class you want to register? Tank, Healer or DPS?"
        });
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
])
.beginDialogAction('calssIntroAction', 'classIntro', { matches: /Can you tell me more/i});

// bot.dialog('introduction', function (session, args, next) {
//     session.send('%j', args);
//     session.send("This is the Advanturer's Guild. A registered member can accept tasks here.");
//     session.endDialog();
    
// })
// .triggerAction({
//     matches: /Can you tell me more/i,
//     onSelectAction: (session, args, next) => {
//         session.beginDialog(args.action, args);
//     }
// });

bot.dialog('classIntro', function(session, args, next) {
    var msg = "Tank and Healer are more diffucult to play, but they find a team faster.";
    session.endDialog(msg);
})

// bot.recognizer({
//     recognize: function (context, done) {
//     var intent = { score: 0.0 };
  
//           if (context.message.text) {
//               switch (context.message.text.toLowerCase()) {
//                   case 'help':
//                       intent = { score: 1.0, intent: 'Help' };
//                       break;
//                   case 'goodbye':
//                       intent = { score: 1.0, intent: 'Goodbye' };
//                       break;
//               }
//           }
//           done(null, intent);
//       }
//   });

// const promptPrefix = 'BotBuilder:prompt-';
// builder.Prompts.text = (session, prompt, options) => {
//     var args = options || {};
//     args.prompt = prompt || args.prompt;

//     // If options.retryPrompt was passed in use this, otherwise use prompt
//     args.retryPrompt = args.retryPrompt || args.prompt;
//     session.beginDialog(promptPrefix + 'text', args);
// }