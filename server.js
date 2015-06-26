// Appel des module dont on a besoin
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var request = require('request');
var pg = require('pg');
var cookie = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var sess;

// Port sur lequel écoute le serveur
server.listen(process.env.PORT || 3000);


// Configuration locale BDD
var config = {};
config.user = 'postgres';
config.password = 'admin';
config.database = 'dashboard';
config.host = 'localhost';
config.port = 5432;


// Configuration Heroku BDD
// var config = {};
// config.user = 'yntviqlzscnbqq';
// config.password = 'w15ISVFDrLBp414QG9sXfbHBMY';
// config.database = 'd80v1h0fvs1qi5';
// config.host = 'ec2-54-204-35-248.compute-1.amazonaws.com';
// config.port = 5432;


//use cookies and sessions for administration login (cookie declaration comes first)
app.use(cookie());
app.use(session({secret:"anystringoftext",
				 saveUninitialized:true,
				 resave:true}));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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
// End of use of static folders

// Render all HTML pages
app.get('/',function(req,res){
  sess=req.session;
  res.sendFile(__dirname + '/index.html');
});
app.get('/index.html',function(req,res){
  sess=req.session;
  res.sendFile(__dirname + '/index.html');
});
app.get('/admin',function(req,res){
  sess=req.session;
  res.sendFile(__dirname + '/admin/login.html');
});
app.get('/admin/lescommentaires',function(req,res){
  sess=req.session;
  if(sess.userid)
  {
  	res.sendFile(__dirname + '/admin/commentaires.html');
  }
  else
  {
  	res.sendFile(__dirname + '/admin/login.html');
  }
});
app.get('/admin/lesliens',function(req,res){
  sess=req.session;
  if(sess.userid)
  {
  	res.sendFile(__dirname + '/admin/liens.html');
  }
  else
  {
  	res.sendFile(__dirname + '/admin/login.html');
  }
});
app.post('/admin/traitement', function(req,res){
	sess=req.session;
	pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM login WHERE username = ($1) AND mdp = ($2)",[req.body.username,req.body.mdp], function(err, rows){
					 if(rows['rowCount'] > 0)
					 {
					 	//sess.username = rows['rows'].username;
					 	sess.userid = req.body.username;
					 	res.sendFile(__dirname + '/admin/administration.html');
					 }
					 else
					 {
					 	res.sendFile(__dirname + '/admin/login.html');
					 }
					 client.end();
				}); 
		  });
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

// Quand un client se connecte, on lui envoi les infos de la page principale
io.sockets.on('connection', function (socket) {
	openweathermeteo('http://api.openweathermap.org/data/2.5/weather?q=montreuil,fr', function(err, result){
		if(err) return console.log(err);
		var mto = [];
		mto['temp'] = result['main']['temp'];
		mto['desc'] = result['weather'][0].description;
		console.log(mto['desc']);
		socket.emit("meteo", {temperature : mto['temp'], description : mto['desc']});
	});

		var messages_affiche = [];
		pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM messages WHERE slider = true", function(err, rows){
					messages_affiche.push(rows);
					socket.emit("messages_affiches", messages_affiche[0].rows);
					 client.end();
				}); 
		  });

		var liens_affiches = [];
		pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM liens", function(err, rows){
					liens_affiches.push(rows);
					console.log(liens_affiches[0].rows);
					socket.emit("liens_affiches", liens_affiches[0].rows);
					 client.end();
				}); 
		  });

	socket.on("new_comment", function (data){
		pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query('INSERT INTO commentaires(comm) VALUES($1)', [data], function(err){
					console.log(err);
					client.end();
				}); 
		  });
	});

	socket.on('new_link', function (data){
		pg.connect(config, function(err, client, done) {
			if (err)
			{
				console.log(err); 
			}
			else 
			{
				client.query('INSERT INTO liens(lien, lienlabel, description) VALUES($1,$2, $3)',[
					data['link'], data['label'], data['desc']], function(err){
					console.log(err);
					client.end();
				});
			}
		  });
	});

	socket.on('supprimer_commentaires', function (data){
		pg.connect(config, function(err, client, done) {
			if (err)
			{
				console.log(err); 
				client.end();
			}
			else 
			{
				for(var i = 0; i < data.length; i++)
				{
					client.query('DELETE FROM commentaires WHERE id ='+data[i], function(err){
						console.log(err);
						client.end();
					}); 
				};
				socket.emit("reload", "reload");
			}
		  });
	});

	socket.on('supprimer_liens', function (data){
		pg.connect(config, function(err, client, done) {
			if (err)
			{
				console.log(err); 
				client.end();
			}
			else 
			{
				for(var i = 0; i < data.length; i++)
				{
					client.query('DELETE FROM liens WHERE id ='+data[i], function(err){
						console.log(err);
						client.end();
					}); 
				};
				socket.emit("reload", "reload");
			}
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
				 client.end();
		  });
		socket.emit("confirmation_nouveau_message", "Formulaire créé avec succès");
	});

	pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM commentaires", function(err, rows){
					if(err)
					{
						console.log(err);
					}
					var commentaires = [];
					commentaires.push(rows);
					socket.emit("commentaires", commentaires[0].rows);
					client.end();
				});
		  });
	});

	
