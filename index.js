var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()


app.set('port', (process.env.PORT || 3000))

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json)

app.get('/', function(req, res){
	res.send('Hello world, I am JD\'s chatbot')
})

app.get('/webhook/', function(req, res){
	if(req.query['hub.verify_token']==='this_is_my_token'){
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

app.listen(app.get('port'), function(){
	console.log('running on port', app.get('port'))
})
