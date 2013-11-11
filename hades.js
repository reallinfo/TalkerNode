// https://dl.dropboxusercontent.com/u/133374/hades.txt
// downloaded at 11/11/2013
// coded by sam@hades
// hades: telnet hades-talker.org 6660

var net = require('net');

var sockets = [];

var port = process.env.PORT || 8888;

/*
 * Cleans the input of carriage return, newline and control characters
 */
function cleanInput(data) {
        var newString = data.toString().replace("[\u0000-\u001f]", "");
        return newString.replace(/(\r\n|\n|\r)/gm,"");
}

/*
 * Method executed when data is received from a socket
 */
function receiveData(socket, data) {


        var cleanData = cleanInput(data);

        if(cleanData.length == 0)
                return;

        console.log("Moo [" + cleanData + "]");

        if(socket.initialshit == undefined)
        {
                socket.initialshit = cleanData;
                return;
        }


        if(socket.username == undefined)
        {
                socket.username = cleanData;
                socket.write("\r\n\r\nWelcome " + socket.username + "\r\n");
        }


        if(cleanData === ".quit") {
                socket.end('Goodbye!\n');
        }
        else {
                for(var i = 0; i<sockets.length; i++) {
                        if (sockets[i] !== socket) {
                                sockets[i].write(socket.username + ": " + data);
                        }
                }
        }
}

/*
 * Method executed when a socket ends
 */
function closeSocket(socket) {
        var i = sockets.indexOf(socket);
        if (i != -1) {
                sockets.splice(i, 1);
        }
}

/*
 * Callback method executed when a new TCP socket is opened.
 */
function newSocket(socket) {
        sockets.push(socket);
        socket.write('Welcome to the Moosville!\r\n\r\nGive me a name:  ');
        socket.on('data', function(data) {
                receiveData(socket, data);
        })
        socket.on('end', function() {
                closeSocket(socket);
        })
}

// Create a new server and provide a callback for when a connection occurs
var server = net.createServer(newSocket);

// Listen on port 8888
server.listen(port);