const express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io'),
    fabric = require('fabric').fabric;

// start webserver on port 8080
const server =  http.createServer(app);
const io = socketIo.listen(server);
server.listen(3000);
// add directory with our static files
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:3000");

// array of all lines drawn
var componentHistory = [];
var client_count = 0;
// event-handler for new incoming connections
function updateComponentHistory(changes) {
    history = componentHistory.find(each => each.id === changes.id);
    if(history) {
        history.left = changes.left;
        history.top = changes.top,
        history.scaleX = changes.scaleX,
        history.scaleY = changes.scaleY,
        history.angle = changes.angle
    }
}
io.on('connection', function (socket) {

   // first send the history to the new client
   for (let component of componentHistory) {
        socket.emit('add_component', component.rawData);
    }
    socket.emit('init_session', {nextObjID: client_count++ * 10000});
//    }

    // add handler for broadcast new component
    socket.on('push_component', function (data) {
        componentHistory.push(data)
        // console.log(data);
        socket.broadcast.emit('add_component', data.rawData);
    })
    socket.on('modify_component', function (data) {
        // console.log(data);
    socket.broadcast.emit('update_component', data);
   })


});
