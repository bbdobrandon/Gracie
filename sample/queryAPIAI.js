var apiai = require("apiai");
var app = apiai("770a544a3c7545d191888148eba35a24");

module.exports = function (message, sessionId, callback){
    var request = app.textRequest(message, {
        sessionId: sessionId
    });
    request.on('response', function(response) {
        callback(response);
    })
    request.on('error', function(error) {
        console.log('%j', error);
    });
    request.end();
} 
