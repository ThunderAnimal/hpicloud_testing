const clients = {};

exports.addClient = function(socket) {
    clients[socket.id] = socket;
};

exports.getClient = function (id) {
    return clients[id];
};

exports.removeClient = function(id){
    delete clients[id];
};