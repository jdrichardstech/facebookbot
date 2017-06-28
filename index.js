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

app.get('/webhook', (req, res)=>{
	if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] ==='this_is_my_token'){
				console.log("Validating webhook");
		    res.status(200).send(req.query['hub.challenge']);
	} else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
})



const token = 'EAAQNLEIhmisBANzygGhCleI2LhxfZAmTsOr3mrixDjFl3MC4ZBtZB2AH1z9s2v7dLCXjZCcdSTpg3mXc96VK5sUy2gZBRTfsArhy9qZBKGl7ciXNRfI4jzymJWfZAl4F8BYa5yRjIp9e014YtohjZBIFZAWJxx1doK3rF8m8Wn88MB3S3mudw8vgCUshUET9nk2YZD'


function sendTextMessage(sender, text){
	messageData = {
		text:text
	}
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

app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic') {
				sendGenericMessage(sender)
				continue
			}
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})

app.listen(app.get('port'), ()=>{
	console.log('running on port', app.get('port'))
})
