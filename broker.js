var fs = require('fs');
var PeerServer = require('peer').PeerServer;

var connections = {}

var server = PeerServer({
    port: 9000,
    path: '/peerjs',
    ssl: {
        key: fs.readFileSync('./certificates/key.pem', 'utf8'),
        cert: fs.readFileSync('./certificates/cert.pem', 'utf8')
    }
});

server.on('connection', (client) => { 
  const id = client.getId()
  console.log("Got client connection ", id)
  
  connections[id] = client
  if (connections.streamer != null) {
    const ids = Object.keys(connections)
    connections.streamer.send({clients: ids})
  }
});

server.on('disconnect', (client) => { 
  console.log("Got disconnected", client.getId())
  if (connections[client.getId()] != null) {
    delete connections[client.getId()]
  }

  if (connections.streamer != null) {
    const ids = Object.keys(connections)
    connections.streamer.send({clients: ids})
  }
  client.send("Server: lost your connection")
});

server.listen(() => {
    console.log("running..")
})
