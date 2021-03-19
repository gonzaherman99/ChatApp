const fs = require('fs');
const net = require('net');
const ejs = require('ejs');
const http = require('http');
const express = require('express');
const WebSocket = require('ws').Server;
const WebSocket2 = require('ws');
const bodyParser = require('body-parser');
//const cookieEncrypter = require('cookie-encrypter');
const app = express();
const server = http.createServer(app);
const usersMap =  new Map();

process.setMaxListeners(15);
//const secretKey = 'foobarbaz195ggvgfvtfcrdxrxesxrdx';

//app.use(cookieEncrypter(secretKey));



app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: false
}));

app.set('view engine', 'ejs');

const storeData = {
		selectedObject: [],
		openPorts: [],
		data: [],
		open: function(variable) {
			this.openPorts.push(variable);
		},
		store: function(variable) {
			this.data.push(variable);
		},
		create: function(name) {
			var obj = {
				chat: [],
			};
    		obj[name] = name;
  			this.open(obj);
  			console.log(`Object created ${JSON.stringify(obj)}`);
		}
}

const busyPorts = {
	array: [],
	myPort: '',
	myUsername: '',
	externalUsers: [],
	setSend: 0,
	agent: '',
	sockets: []
};

function storeDataFunction(argument) {
	for (var i = 0; i <= storeData.openPorts.length; i++) {
		if (storeData.openPorts[i] === argument) {
			//console.log(storeData.openPorts[i]);
		} else {
			storeData.create(argument);
			break;
		}
	}
}


//login or start page
app.route('/')
	.post(function(req, res, next) {

		var username = req.body.user;
		busyPorts.myUsername = req.body.user;
		var port = '';


		if (username !== '') {
			function portGenerator() {
				port = Math.floor(Math.random() * 100000) + 1000;
				busyPorts.myPort = port;
			}
			portGenerator();

			for (var i = 0; i < busyPorts.array.length; i++) {
				if (port === busyPorts.array[i]) {
					portGenerator();
				}
			}

			usersMap.set(port, username);
			busyPorts.array.push(port);

			/*busyPorts.agent = new http.Agent({keepAlive: true});

			var options = {
				port: 3000
			}

			var createConnection = busyPorts.agent.createConnection(options, function(err, stream) {
				if (err) {
					throw error;
				} else {
					console.log(stream);
				}
			});

			const object = {
				socket: createConnection
			};

			object[port] = port;

			busyPorts.sockets.push(object);

			console.log(busyPorts.sockets);*/

			
			res.redirect("/main");
		} else {
			res.render("start.ejs");
		}

		
	})
	.get(function(req, res) {
		res.render('start.ejs');
	});


//main page
app.route('/main')
	.get(function(req, res) {

		const cookieParams = {
    		httpOnly: true,
    		signed: true,
    		maxAge: 300000,
  		};

		var arrayPorts = [];
		var arrayUsers = [];
		for (var [key, value] of usersMap) {
			arrayPorts.push(key);
			arrayUsers.push(value);
		}

		busyPorts.externalUsers = [...arrayUsers];

		res.cookie("ports", arrayPorts);
		res.cookie("users", arrayUsers);

		res.render("main.ejs");
		
	})
	.post(function(req, res) {
		var portUsed = JSON.parse(JSON.stringify(req.body));
		var index = busyPorts.array.indexOf(portUsed);
		var name = usersMap.get(busyPorts.array[index]);
		console.log(`Port ${JSON.parse(JSON.stringify(portUsed))}`);
		var valueFromFor;
		var index;

		for (var  value in portUsed) {
			storeDataFunction(value);
			var valueFromFor = value;
		}

		var toNumber = Number(valueFromFor);

		index = busyPorts.array.indexOf(toNumber);
		var name2 = busyPorts.externalUsers[index];

		res.render('chat.ejs', {name: name2, port: portUsed});
	})

app.route('/delete')
	.post(function(req, res) {
		 var port = (req.body.port);
		 var myport = (req.body.myport);
		 console.log(port);
		 console.log(myport);

		 for (var i = 0; i <= storeData.selectedObject.length; i++) {
		 	var getO = storeData.selectedObject[i];
		 	if (getO === undefined) {
		 		console.log("We are chekcing an undefined");
		 	} else {
		 		console.log(getO[1]);
		 	}
		 	getO = [...getO];
		 	console.log(`This is the one we are checking, ${JSON.stringify(getO[0])}`);
		 	let key = Object.keys(getO[0]);
		 	if (key[0] === myport) {
		 			delete getO.chat;
		 			console.log(getO.chat);
		 	}
		 }
	})

//chat page
app.route('/chat')
	.get(function(req, res) {
		res.render('chat.ejs');
		res.cookie("ports", arrayPorts);
		res.cookie("users", arrayUsers);
	})

server.listen(3000, function(req, res) {
	console.log('Port listening in 3000');
});



const wss = new WebSocket({server: server, path: '/'});

	wss.on('connection', function connection(ws) {



		ws.on('message', function incoming(message) {

			console.log(`Messages received ${message}`);

			//Motiring to see if you have a message "Notifications"
			setInterval(function() {
				//console.log(`Monitoring chats ${JSON.stringify(storeData.selectedObject)}`);
				for (var i = 0; i < storeData.selectedObject.length; i++) {

					if (storeData.selectedObject[i][0].chat.length !== null) {
				
							var notification;
							var sender;
							notification = JSON.stringify(storeData.selectedObject[i][0].chat[0]);
							sender = JSON.stringify(storeData.selectedObject[i][1]);

							//console.log(`Sender port ${sender}`);


							if (notification !== undefined) {
								var notification2 = notification.split(',');
								notification2.push('1');
								notification2.unshift('1');
								var notification3 = notification2.join();
								//console.log(typeof notification3);
								//console.log(`Part we we check for chats ${notification3}`);
								ws.send(`${notification3}, ${sender}`);
							}

					}
					
				}

			}, 5000);


			//Send chat refreshers
			setInterval(function() {

				for (var i = 0; i < storeData.selectedObject.length; i++) {

					if (storeData.selectedObject[i][0].chat) {

						var key = Object.keys(storeData.selectedObject[i][0])[0]

						var check = storeData.selectedObject.filter(x => x[1] === key);

						if (check[0] !== undefined) {
							var chat = check[0][0].chat.toString();
							var chat2 = storeData.selectedObject[i][0].chat.toString();
							var array = [2, chat, chat2, 2];
							ws.send(array.join());
						} 

					}

				}

			}, 10000);


			/*This is to check on the loop for the incoming port of the 
			user that is been open*/
			if (/\d+,\d+/.exec(message)) {

				var r = message.split(',');
				console.log(r[1]);

				for (var i = 0; i <= storeData.openPorts.length; i++) {

					for (var  key in storeData.openPorts[i]) {
						if (r[0] === key) {

							//console.log(`This is the sender port ${r[1]}`);
							//console.log(`this is when we store the port ${JSON.stringify([storeData.openPorts[i], r[1]])}`);
							storeData.selectedObject.push([storeData.openPorts[i], r[1]]);
							//console.log(`The selected object ${JSON.stringify(storeData.selectedObject)}`);

						}
					}

				}

			} else {


			for (var i = 0; i < storeData.selectedObject.length; i++) {
				if (storeData.selectedObject[i] === undefined) {
					return 'none';
				} else {

					if (/\d,\w/.exec(message)) {

						var d = message.split(",");

						//console.log(`Check the port on the message ${d[0]}`);
						//console.log(typeof d[]);

						for (var i = 0; i < storeData.selectedObject.length; i++) {
							//console.log(typeof storeData.selectedObject[i]);
							//console.log(Object.keys(storeData.selectedObject[i]));

							//console.log(`What is this shit ${storeData.selectedObject[i]}`);

							if (d[0] === storeData.selectedObject[i][1]) {

								var chat = storeData.selectedObject[i][0].chat.toString();

								//console.log(`This is when you send the data of the other user ${chat}`);
			
								ws.send(chat);

							} else if (d[0] === Object.keys(storeData.selectedObject[i][0])[0]) {

									//console.log("Found the object in the array");
									storeData.selectedObject[i][0].chat.push(message);

									//console.log(`This is when the data is sent ${JSON.stringify(storeData.selectedObject[i])}`);


									var chat = storeData.selectedObject[i][0].chat.toString();
									
								
									ws.send(chat);

								} else {

									//console.log(`Error with key:${key}`);
									//console.log(`Error with message :${d[0]}`);

								}
							
						}


					} 

				}
			}
		}

  		});

  		ws.send('Hello from the server');
	});


/*const proxy = http.createServer((req, res) => {
	res.writeHead(200, {'Content-Type' : 'tetx/html'});
	res.end('done');
});

proxy.on('connect', (req, clientSocket, head) => {
	const { port, host } = new URL('http://localhost:3000');
	const serverSocket = net.connect(port || 3000, host, () => {
		clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');

		serverSocket.write(head);
    	serverSocket.pipe(clientSocket);
    	clientSocket.pipe(serverSocket);
	});
});

proxy.listen(3000, '127.0.0.3', () => {

const optionsProxy = {
	port: 3000,
	host: '127.0.0.3',
	method: 'CONNECT',
	path: '/'
};

const req = http.request(optionsProxy);
req.end();

req.on('connect', (res, socket, head) =>{
	console.log('Got connected');

	socket.write('GET FUCK');
	socket.on('data', (chunk) => {
		console.log(chunk.toString());
	});
	 	socket.on('end', () => {
      		proxy.close();
    	});
	});
});*/

	
