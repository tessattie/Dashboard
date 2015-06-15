var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var request = require('request');
var pg = require('pg');

server.listen(process.env.PORT || 3000);

// Use static folders with node.js
app.use("/bootstrap", express.static(__dirname + '/bootstrap'));
app.use("/bild", express.static(__dirname + '/build'));
app.use("/dist", express.static(__dirname + '/dist'));
app.use("/font", express.static(__dirname + '/font'));
app.use("/documentation", express.static(__dirname + '/documentation'));
app.use("/pages", express.static(__dirname + '/pages'));
app.use("/plugins", express.static(__dirname + '/plugins'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/admin", express.static(__dirname + '/admin'));
app.use("/js", express.static(__dirname + '/js'));


app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
});

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

app.get('/admin/administration.html',function(req,res){
  res.sendFile(__dirname + '/admin/administration.html');
});

app.get('/admin/tromi.html',function(req,res){
  res.sendFile(__dirname + '/admin/trombi.html');
});

app.get('/admin/boite.html',function(req,res){
  res.sendFile(__dirname + '/admin/boite.html');
});

app.get('/admin/liens.html',function(req,res){
  res.sendFile(__dirname + '/admin/liens.html');
});
// End of rendering HTML pages

// OpenWeatherMAp : envoi des données MTO 
var openweathermeteo = function(url, callback){
	
	request(url, function(err, response, body){
		try{
			var result = JSON.parse(body);
			  		
			callback(null, result);
		}catch(e){
			callback(e); 
		}
	});
}

// Quand on client se connecte, on lui envoi un message pour lui avertir
io.sockets.on('connection', function (socket) {
	openweathermeteo('http://api.openweathermap.org/data/2.5/weather?q=montreuil,fr', function(err, result){
		if(err) return console.log(err);
		var mto = [];
		//mto['latitude'] = result['city']['coord']['lat'];
		//mto['longitude'] = result['city']['coord']['lat'];
		mto['temp'] = result['main']['temp'];
		//mto['temp_min'] = result['list'][0]['temp']['min'];
		//mto['temp_max'] = result['list'][0]['temp']['max'];
		mto['desc'] = result['weather'][0].description;
		console.log(result['weather'][0].description);
		socket.emit("meteo", {temperature : mto['temp'], description : mto['desc']});
		});
});