var builder = require('botbuilder');
var queryAPIAI = require('./queryAPIAI');

module.exports.greeting = [
    function (session, args) {
        session.dialogData.profile = args || {};
        if (session.dialogData.profile.name) {
            var customer_name = session.dialogData.profile.name;
            session.send(`Hey ${customer_name}, how are you doing?`);
            session.endDialogWithResult({ response: session.dialogData.profile});    
        }
        else{
            session.beginDialog('askName');
        }
    }
];

module.exports.askName = [
    function(session, args){
        builder.Prompts.text(session, "A new customer! May I have you name please?", {
            retryPrompt: "Now, may I have your name?"
        });
    },
    function(session, results){
        session.dialogData.profile = {};
        var msg = results.response;
        var sessionId = '1';
        queryAPIAI(msg, sessionId, function(response){
            var intent = response.result.metadata.intentName;
            if(intent=='GiveName'){
                var entity = Object.values(response.result.parameters)[0];
                if('first-name' in entity){
                    name = entity['first-name'];
                }
                else{
                    name = entity['last-name'];
                }
            }
            session.send(`${name} right? Nice to meet you!`);
            session.dialogData.profile.name = name;
            session.endDialogWithResult({ response: session.dialogData.profile});
        });
    }
];