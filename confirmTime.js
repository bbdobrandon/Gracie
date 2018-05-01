var builder = require('botbuilder');
var apiai = require('./apiai_recognizer');
var utils = require('./utils');

var lib = new builder.Library('confirmTime');

lib.dialog('/', [
    function (session, args, next) {
        session.send('[Start ConfirmTime Dialog]');
        session.dialogData.givenTime = args.data;
        session.dialogData.reprompt = args.reprompt;
        session.send('GivenTime: %j', args.data);
        session.send('Reprompt: %d', args.reprompt);
        if (args.data.complete) {
			session.userData.profile.confirmation.time.date = utils.parseDate(args.data.date);	
				[session.userData.profile.confirmation.time.hour,
					session.userData.profile.confirmation.time.minute] = utils.parseDate(args.data.time);		            
            session.endDialogWithResult({reply: "perfect, let's meet at that time!"});
        }
        else if (args.reprompt > 3) {
            session.endConversation("you are wasting my time, now drop off my number.");
        }
        else if (args.reply) {
            builder.Prompts.text(session, args.reply);
        }
        else {
            builder.Prompts.text(session, 'so what time works for you?');
        }
        
    },
    function (session, args, next) {
        var msg = args.response;
        apiai.recognizer.recognize({message:{text:msg}}, function(error, response) {
            var intent = response.intent;
            var entities = response.entities;
            var exactTime = (entities['exact-time'] && entities['exact-time'].length > 0) ? entities['exact-time'] : null;
            var relativeTime = entities['relative-time'] || null;
            var givenTime = session.dialogData.givenTime;
            console.log('exactTime: %j', exactTime);
            console.log('relativeTime: %j', relativeTime);
            //if response irrelevant
            if (intent != 'Intent.Availability' && 
                !(['Default Fallback Intent', 'Intent.Give_TimeSlot'].indexOf(intent) >= 0 && (exactTime || relativeTime))) {
                session.beginDialog('/continueTime', {data: session.dialogData.givenTime, reprompt: 0, reprompt_stored: session.dialogData.reprompt});
            }
            //if no time given, suggest time
            else if (!exactTime && !relativeTime) {
                session.beginDialog('/suggestTime', {data: session.dialogData.givenTime, reprompt:0, reprompt_stored: session.dialogData.reprompt});
            }
            else {
                var givenTime_new = utils.fillTime(exactTime, relativeTime);     
                session.send('Newly Accepted Time input: %j', givenTime_new);
                if (givenTime.date && givenTime.date != 'today' && !exactTime.date) {
                    givenTime_new.date = givenTime.date;
                }
                else {
                    givenTime_new.date = givenTime_new.date;
                }
                givenTime_new.date = givenTime_new.date || givenTime.date;
                givenTime_new.time = givenTime_new.time || givenTime.time;
                givenTime_new.complete = (givenTime_new.date && givenTime_new.time && givenTime_new.time != 'now') ? 1 : 0;
                givenTime_new.exactTime =  Object.keys(givenTime_new.exactTime).length > 0 ? givenTime_new.exactTime : givenTime.exactTime;
                givenTime_new.relativeTime = Object.keys(givenTime_new.relativeTime).length > 0 ? givenTime_new.relativeTime : givenTime.relativeTime;   
                session.send('Updated givenTime: %j', givenTime_new)       
                if (givenTime_new.complete) {
                    var date = utils.parseDate(givenTime_new.date);	
                    var [hour, min] = utils.parseTime(givenTime_new.time);
                    session.userData.profile.confirmation.time.date = date;
                    [session.userData.profile.confirmation.time.hour,
                        session.userData.profile.confirmation.time.minute] = [hour, min];	
                    var reply = `Perfect, I'll see you at ${hour}` + (min ? `:${min}` : '') + ` ${date}`;
                    session.send(reply);	
                    session.endDialogWithResult({data: {date: givenTime_new.date, time: givenTime_new.time}});
                } 
                else {
                    var reply = 'sure, can you be more specific?';
                    session.replaceDialog('/', {data: givenTime_new, reply: reply, reprompt: session.dialogData.reprompt + 1});
                }    
            }
        });  
    }
]);
//1. More variation of reprompt response and increase reprompt limit
//2. Direct some of intents to other dialogs and return
//3. Add one-sentence handler and continue current topic
lib.dialog('/continueTime', [
    function (session, args, next) {
        if (args.reprompt > 1) {
            session.endConversation("Drop off my number you are wasting my time.");
        }        
        else {
            session.dialogData.givenTime = args.data;
            session.dialogData.reprompt = args.reprompt;
            session.dialogData.reprompt_stored = args.reprompt_stored;
            session.send('reprompt: %d', args.reprompt);
            if (args && args.reprompt) {
                builder.Prompts.text(session, 'can we confirm time first?');
            }
            else {
                builder.Prompts.text(session, 'Mind letting me know what time you have in mind first?');
            }      
        }
    },
    function (session, args, next) {
        var msg = args.response;
        apiai.recognizer.recognize({message:{text:msg}}, function(error, response){
            var intent = response.intent;
            var entities = response.entities || '';
            var exactTime = entities['exact-time'] || null;
            var relativeTime = entities['relative-time'] || null;
            if (intent == 'Intent.Confirmation_Yes' || 
                ((intent == 'Intent.Give_TimeSlot' || intent == 'Intent.Availability') && 
                ((exactTime && exactTime.length > 0) || relativeTime))) {
                    session.send('great!');
                var givenTime = session.dialogData.givenTime;
                var givenTime_new = utils.fillTime(exactTime, relativeTime);
                
                givenTime_new.date = givenTime_new.date || givenTime.date;
                givenTime_new.time = givenTime_new.time || givenTime.time;
                givenTime_new.complete = (givenTime_new.date && givenTime_new.time && givenTime_new.time != 'now') ? 1 : 0;
                givenTime_new.exactTime =  Object.keys(givenTime_new.exactTime).length ? givenTime_new.exacTime : givenTime.exactTime;
                givenTime_new.relativeTime = Object.keys(givenTime_new.relativeTime).length ? givenTime_new.relativeTime : givenTime.relativeTime;
                // session.send('Old: %j', givenTime);
                // session.send('New: %j', givenTime_new);
                session.replaceDialog('/', {data: givenTime_new, reply: 'when would you like to meet?', reprompt: session.dialogData.reprompt_stored + 1});
            }
            else {
                session.replaceDialog('/continueTime', 
                    {
                        data: session.dialogData.givenTime, 
                        reprompt: session.dialogData.reprompt + 1, 
                        reprompt_stored: session.dialogData.reprompt_stored
                    }
                );
            }
        });        

    }
]);

lib.dialog('/suggestTime', [
    function (session, args, next) {
        session.endDialog('[Test Suggest Time]');
        session.dialogData.givenTime = args.data;
        var givenTIme = args.data;
        


        
    }
]);
module.exports.createLibrary = function(){
    return lib.clone();
};