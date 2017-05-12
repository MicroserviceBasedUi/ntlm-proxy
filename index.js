'option strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const tunnel = require('./insightTunnel');

// you can pass the parameter in the command line. e.g. node index.js 9001
const port = process.argv[2] || 9001;
const config = JSON.parse(fs.readFileSync('appconfig.json', 'utf8'));

http.createServer(function (request, response) {

    if (request.url.startsWith("/components")) {
        serveComponent(request, response);
    } else {
        tunnel.tunnelInsightRequest(config, request, response);
    }
}).listen(parseInt(port));

function serveComponent(req, res) {
    console.log(`${req.method} ${req.url}`);
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`;
    // maps file extention to MIME types
    const mimeType = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.eot': 'appliaction/vnd.ms-fontobject',
        '.ttf': 'aplication/font-sfnt'
    };

    fs.exists(pathname, function (exist) {
        if (!exist) {
            // if the file is not found, return 404
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }
        // if is a directory, then look for index.html
        if (fs.statSync(pathname).isDirectory()) {
            pathname += '/index.html';
        }
        // read file from file system
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                const ext = path.parse(pathname).ext;
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type', mimeType[ext] || 'text/plain');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(data);
            }
        });
    });
}

console.log(`Running on port ${port} and proxying request to base URL ${config.baseUrl} with user ${config.user}`);
