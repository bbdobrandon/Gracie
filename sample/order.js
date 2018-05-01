var builder = require('botbuilder');
var queryAPIAI = require('./queryAPIAI');

module.exports.askNewOrder = [
    function(session, args){
        builder.Prompts.text(session, "Do you want to order a dragon today?", {
            retryPrompt: "Now, wanna order a dragon?"
        });
    },
    function(session, results){
        session.dialogData.profile = {};
        var msg = results.response;
        var sessionId = '1';
        queryAPIAI(msg, sessionId, function(response){
            var intent = response.result.metadata.intentName;
            if(intent=='smalltalk.confirmation.no'){
                session.endDialog('I see, see you next time!');  
            }
            else{
                session.endDialog('Great, I will try my best to find you your dream dragon! Shall we start with color?')
            }
        });
    }
];