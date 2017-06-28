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
	if(req.query['hub.verify_token']==='this_is_my_token'){
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

app.post('/webhook',(req, res)=>{
	messaging_events = req.body.entry[0].messaging
	for(i=0;i<messaging_events.length; i++){
		event = req.body.entry[0].messaging[i]
		sender = event.sender.id
		if(event.message && event.message.text){
			text=event.message.textsendTextMessage(sender, "Text received, echo: " + text.substring(0,200))
		}
	}
	res.sendStatus(200)
})

const token = 'EAAQNLEIhmisBAA0WCNUP7gqBEQZBcEmDrTZBL6XcxlnY33282dAWpANOsatgZCTCIhHqX3gNu99fJXjn5lh1dhrU8IsVZC8iwnrqW2hbY0TxTGr5NoIyCgDjECuylBVwNHITPI7M7kJt5xqiFbcMQaHiS7wsY7qTeJWV17ZAKMRJQzjgTvhI3UNuWbmZA9zWwZD'


let sendTextMessage = (sender, text)=>{
	messageData = {
		text:text
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

app.listen(app.get('port'), ()=>{
	console.log('running on port', app.get('port'))
})
