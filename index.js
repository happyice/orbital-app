var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = {},
	path = require('path'),
	port = process.env.PORT || 8080;
	
var jade = require('jade');
// var io = require('socket.io').listen(app);
var pseudoArray = ['admin']; //block the admin username (you can disable it)

//configure app
server.listen(port);
// app.listen(appPort);
console.log("Server listening on port " + port);

//add middleware
app.use(express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'bower_components')));
//app.use(bodyParser());



//defining routes
app.get('/', function (req,res){
	  res.render(path.join(__dirname+'/views/home.ejs'));
});

app.get('/matchmake',function(req,res){
  res.sendFile(path.join(__dirname+'/views/Matchmake.html'));
});

app.get('/openjohn',function(req,res){
  res.sendFile(path.join(__dirname+'/views/MatchmakePerson.html'));
});

app.get('/matched',function(req,res){
  res.sendFile(path.join(__dirname+'/views/MatchmakeSuccess.html'));
});

app.get('/openchat',function(req,res){
 res.render('home.jade');
  res.render(path.join(__dirname+'/views/home.jade'));
});

var users = 0; //count the users

io.sockets.on('connection', function (socket) { // First connection
	users += 1; // Add 1 to the count
	reloadUsers(); // Send the count to all the users
	socket.on('message', function (data) { // Broadcast the message to all
		if(pseudoSet(socket))
		{
			var transmit = {date : new Date().toISOString(), pseudo : socket.nickname, message : data};
			socket.broadcast.emit('message', transmit);
			console.log("user "+ transmit['pseudo'] +" said \""+data+"\"");
		}
	});
	
	socket.on('setPseudo', function (data) { // Assign a name to the user
		if (pseudoArray.indexOf(data) == -1) // Test if the name is already taken
		{
			pseudoArray.push(data);
			socket.nickname = data;
			socket.emit('pseudoStatus', 'ok');
			console.log("user " + data + " connected");
		}
		else
		{
			socket.emit('pseudoStatus', 'error') // Send the error
		}
	});

	socket.on('disconnect', function () { // Disconnection of the client
		users -= 1;
		reloadUsers();
		if (pseudoSet(socket))
		{
			console.log("disconnect...");
			var pseudo;
			pseudo = socket.nickname;
			var index = pseudoArray.indexOf(pseudo);
			pseudo.slice(index - 1, 1);
		}
	});
});

function reloadUsers() { // Send the count of the users to all
	io.sockets.emit('nbUsers', {"nb": users});
}
function pseudoSet(socket) { // Test if the user has a name
	var test;
	if (socket.nickname == null ) test = false;
	else test = true;
	return test;
}