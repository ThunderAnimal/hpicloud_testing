const socketManager = require('../app/modules/socket-manager');

module.exports = function(io){

    // Event fired every time a new client connects:
    io.sockets.on('connection', function (socket) {
        console.info('New Client connected( ' + socket.id + ')');
        socketManager.addClient(socket);

        //Socket ID zum zum Client schicken
        socket.emit('connected', {socket_id: socket.id});

        socket.on('disconnect', function () {
            console.info('Client disconnected( ' + socket.id + ')');
            socketManager.removeClient(socket.id);
        });
    });
};