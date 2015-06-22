var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var request = require('request');
var pg = require('pg');

// var conString = "postgres://yntviqlzscnbqq:w15ISVFDrLBp414QG9sXfbHBMY@ec2-54-204-35-248.compute-1.amazonaws.com:5432/d80v1h0fvs1qi5";
// var localString = process.env.DATABASE_URL || 'postgres://localhost:5432/?password=admin';
server.listen(process.env.PORT || 3000);

// var config = {};
// config.user = 'postgres';
// config.password = 'admin';
// config.database = 'dashboard';
// config.host = 'localhost';
// config.port = 5432;

var config = {};
config.user = 'yntviqlzscnbqq';
config.password = 'w15ISVFDrLBp414QG9sXfbHBMY';
config.database = 'd80v1h0fvs1qi5';
config.host = 'ec2-54-204-35-248.compute-1.amazonaws.com';
config.port = 5432;

// Use static folders with node.js
app.use("/bootstrap", express.static(__dirname + '/bootstrap'));
app.use("/bild", express.static(__dirname + '/build'));
app.use("/dist", express.static(__dirname + '/dist'));
app.use("/font", express.static(__dirname + '/font'));
app.use("/documentation", express.static(__dirname + '/documentation'));
app.use("/pages", express.static(__dirname + '/pages'));
app.use("/plugins", express.static(__dirname + '/plugins'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/admin", express.static(__dirname + '/admin'));
app.use("/js", express.static(__dirname + '/js'));

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

app.get('/admin/commentaires.html',function(req,res){
  res.sendFile(__dirname + '/admin/commentaires.html');
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
		console.log(mto['desc']);
		socket.emit("meteo", {temperature : mto['temp'], description : mto['desc']});
		var messages_affiche = [];
		pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM messages WHERE slider = true", function(err, rows){
					messages_affiche.push(rows);
					console.log(messages_affiche[0].rows[0].title);
					socket.emit("messages_affiches", messages_affiche[0].rows);
				}); 
		  });
	});

	socket.on("new_comment", function (data){
		pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query('INSERT INTO commentaires(comm) VALUES($1)', [data], function(err){
					console.log(err);
				}); 
		  });
	});

	socket.on('supprimer_commentaires', function (data){
		pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				for(var i = 0; i < data.length; i++)
				{
					client.query('DELETE FROM commentaires WHERE id ='+data[i], function(err){
						console.log(err);
					}); 
				};
				socket.emit("reload", "reload");
		  });
	});

	socket.on('nouveau_message', function (data){
		pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query('INSERT INTO messages(title, message, nom, prenom, slider, the_date) VALUES($1,$2,$3,$4,$5,$6)',[
					data['titre'], data['message'], data['nom'], data['prenom'], data['slider'], data['the_date']], function(err){
					console.log(err);
				}); 
		  });
		socket.emit("confirmation_nouveau_message", "Formulaire créé avec succès");
	});

	pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM commentaires", function(err, rows){
					var commentaires = [];
					commentaires.push(rows);
					console.log(err);
					socket.emit("commentaires", commentaires[0].rows);
				}); 
		  });

	// socket.on('nouvelle_promo', function (nouvelle_promo){
	// 	var today = new Date();
	// 	var dd = today.getDate();
	// 	var mm = today.getMonth()+1; //January is 0!
	// 	var yyyy = today.getFullYear();

	// 	if(dd<10) {
	// 	    dd='0'+dd
	// 	} 

	// 	if(mm<10) {
	// 	    mm='0'+mm
	// 	} 

	// 	var current_date = yyyy+'/'+mm+'/'+dd;
	// 	pg.connect(config, function(err, client, done) {
	// 		if (err)
	// 			console.log(err); 
	// 		else 
	// 			client.query('INSERT INTO promos(numero, lieu, date) VALUES($1,$2,$3)',[nouvelle_promo['numero_promo'],
	// 				nouvelle_promo['lieu_promo'], current_date], function(err){
	// 				console.log(err);
	// 			}); 
	// 	  });
	// 		socket.emit("confirmation_nouvelle_promo", "Vous avez créé une nouvelle promo!");
	// 	});
});
