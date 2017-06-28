const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()


app.set('port', (process.env.PORT || 3000))

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.get('/', (req, res)=>{
	res.send("This is the HBL Facebook Bot")
})

app.get('/webhook/', (req, res)=>{
	if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] ==='this_is_my_token'){
				console.log("Validating webhook");
		    res.status(200).send(req.query['hub.challenge']);
	} else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
})



const token = 'EAAQNLEIhmisBAAWsVLyaa0VrzS8x9LbjoEgZCCkAmyaxWCjwyEFiHGh2ysUP38TaMIofSUAx26cLP9rurVWRUuNxtyYQfO9LLSVzbg3jUo9kpLOt4nEo57GMwQ31ZARmjrvFcXlzccTS07fpmBDm8NduyXHpQNczxj3ZCT8vIsXFvs7l6aP7dhClWor1zkZD'


function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAQNLEIhmisBAAWsVLyaa0VrzS8x9LbjoEgZCCkAmyaxWCjwyEFiHGh2ysUP38TaMIofSUAx26cLP9rurVWRUuNxtyYQfO9LLSVzbg3jUo9kpLOt4nEo57GMwQ31ZARmjrvFcXlzccTS07fpmBDm8NduyXHpQNczxj3ZCT8vIsXFvs7l6aP7dhClWor1zkZD '},
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

	function sendGenericMessage(sender){
		 let messageData = {
			 "attachment": {
				 "type": "template",
				 "payload": {
				 "template_type": "generic",
					 "elements": [{
					 "title": "First card",
						 "subtitle": "Element #1 of an hscroll",
						 "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
						 "buttons": [{
							 "type": "web_url",
							 "url": "https://www.messenger.com",
							 "title": "web url"
						 }, {
							 "type": "postback",
							 "title": "Postback",
							 "payload": "Payload for first element in a generic bubble",
						 }],
					 }, {
						 "title": "Second card",
						 "subtitle": "Element #2 of an hscroll",
						 "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
						 "buttons": [{
							 "type": "postback",
							 "title": "Postback",
							 "payload": "Payload for second element in a generic bubble",
						 }],
					 }]
				 }
			 }
		 }
	request({
		url:'https:/graph.facebook.com/v2.6/me/messages',
		qs:{access_token: token},
		method: 'POST',
		json: {
			recipient: {id: sender},
			message: messageData,
		}
	},
		function(error, response, body){
			if(error){
				console.log("Error sending messages: ", error)
			}else if (response.body.error){
				console.log("Error: ", response.body.error)
			}
	})
}

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

app.listen(app.get('port'), ()=>{
	console.log('running on port', app.get('port'))
})
