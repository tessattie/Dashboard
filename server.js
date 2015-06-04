var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);
// var request = require('request');
// var emitter = require('events').EventEmitter;
// var fs = require('fs');
// var WebSocketServer = require('ws').Server
// 	,wss = new WebSocketServer({ port: 3000 });

// wss.on('connection', function connection(ws) {
//   	ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
// 	});
// 	ws.send('something');
// });

// app.use(express.bodyParser());
// app.use(express.methodOverride());
// app.use(app.router);


// Use static folders with node.js
app.use("/bootstrap", express.static(__dirname + '/bootstrap'));
app.use("/bild", express.static(__dirname + '/build'));
app.use("/dist", express.static(__dirname + '/dist'));
app.use("/font", express.static(__dirname + '/font'));
app.use("/documentation", express.static(__dirname + '/documentation'));
app.use("/pages", express.static(__dirname + '/pages'));
app.use("/plugins", express.static(__dirname + '/plugins'));

// Render all HTML pages
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.html',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/pages/calendar.html',function(req,res){
  res.sendFile(__dirname + '/pages/calendar.html');
});

app.get('/documentation/index.html',function(req,res){
  res.sendFile(__dirname + '/documentation/index.html');
});
// End of rendering HTML pages

// var port = Number(process.env.PORT || 3000);

// var server = http.createServer(app);

// server.listen(port, function(){
// 	console.log('Server listening on port' + port);
// });

// io = require('socket.io').listen(server);


// // Configuration pour permettre le fonctionnement sur HEROKU
// io.use(function () {  
//   io.set("transports", ["xhr-polling"]); 
//   io.set("polling duration", 10); 
// });

// Quand on client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
        socket.emit('message', 'Vous êtes bien connecté !');
});

// Create webSocketServer





// Create server to listen to events and rendrer a response
// var server = http.createServer(function(req, res) {
// 	    fs.readFile(__dirname + '/index.html','utf-8', function (err, data) {
// 	    res.writeHead(200, {'Content-Type': 'text/html'});
// 	    res.end(data);
// 	    });

// });

// // Chargement de socket.io
// var io = require('socket.io').listen(server);


// var port = Number(process.env.PORT || 8080);
// server.listen(8080);
// OpenWeatherMAp : envoi des données MTO 
// var openweathermeteo = function(url, callback){
	
// 	request(url, function(err, response, body){
// 		try{
// 			var result = JSON.parse(body);
			  		
// 			callback(null, result);
// 		}catch(e){
// 			callback(e); 
// 		}
// 	});
// }

// openweathermeteo('http://api.openweathermap.org/data/2.5/weather?q=Montreuil,fr', function(err, result){
// 	if(err) return console.log(err);
// 	var mto = [];
// 	mto['latitude'] = result['coord']['lat'];
// 	mto['longitude'] = result['coord']['lon'];
// 	mto['temp'] = result['main']['temp'];
// 	mto['temp_min'] = result['main']['temp_min'];
// 	mto['temp_max'] = result['main']['temp_max'];
// 	mto['desc'] = result.weather['0']['main'];
// });

//Setup of PORT value fot application to work with heroku
// var port = Number(process.env.PORT || 3000);
// app.listen(port);
// console.log("Running at Port " + port);