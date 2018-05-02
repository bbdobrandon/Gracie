##Intents for node.js-based systems

If you write node modules (Mongoose plugins for example) that rely on 3rd party services like email, s3, iOS and Android push notifications, it's hard to keep versatility. Intents are set of protocols and standards which let outsource 3rd party services configuration to user from your universal aspect oriented modules.

Installation:

    npm install intents

Usage (in libraries):

    var email = require('intents').email;
    var storage = require('intents').storage;
    
    # ...
    
    email.send({sender: sender, recipient: recipient, topic: topic, text: text}, function(error) {
        if(!error) {
          console.log("Email sent");
        }
    });
    
    storage.uploadPng({filename: filename, content: content}, function(error, url) {
      if (!error) {
        console.log("File uploaded to " + url);
      }
    });

Usage (in client's application):

./config/default.js
    
    var email = require('intents-ses');
    var s3 = require('intents-s3');
      
    exports.email = ses({
      key: 'my-key'
      secret: 'my-secret'
    });
    
    exports.storage = s3({
      key: 'my-key'
      secret: 'my-secret'
      bucket: 'my-bucket
    });