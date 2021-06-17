const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path')
const cors = require('cors')
const { ExpressPeerServer } = require('peer');

const app = express();
app.enable('trust proxy');

// const basePath = "/Users/ianloubser/Library/Application Support/Caddy/certificates/local"
// const ip = "192.168.1.219";

// Public Self-Signed Certificates for HTTPS connection
var privateKey  = fs.readFileSync('./certificates/key.pem', 'utf8');
var certificate = fs.readFileSync('./certificates/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/static', express.static('./static'))
  
app.get('/stream', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/play', (req, res) => {
    res.sendFile(path.join(__dirname, 'play.html'))
})

console.log("Server started")


// Allow access from all the devices of the network (as long as connections are allowed by the firewall)
var LANAccess = "0.0.0.0";
// For http
httpServer.listen(8080, LANAccess);
// For https
httpsServer.listen(8443, LANAccess);

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname+'/index.html'));
// });

// // Expose the css and js resources as "resources"
// app.use('/resources', express.static('./source'));

// server.listen(443);
