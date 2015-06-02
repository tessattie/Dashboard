var http = require('http');

// On instancie un nouveau serveur 
var server = http.createServer(function(req,res){
// Définition du type de réponse envoyé
	res.writeHead(200, {'Content-Type' : 'text/html'});

// Définition du contenu de notre page
	res.end('<h1>Hello World!</h1>');
})

// Sur Heroku, on ne sait pas de quel port il s'agit donc nous devons 
// créer une variable nous permettant de récupérer le port qui nous est 
// attribué
var port = Number(process.env.PORT || 3000)
server.listen(port);