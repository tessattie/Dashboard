var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var request = require('request');

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

// Quand on client se connecte, on lui envoi un message pour lui avertir
io.sockets.on('connection', function (socket) {
		socket.emit("message", "Vous êtes connecté");
		});