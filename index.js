'option strict';

const http = require('http');
const httpntlm = require('httpntlm');
const fs = require('fs');
const mock = require('./mock.js');
const url = require('url');
const path = require('path');

// you can pass the parameter in the command line. e.g. node index.js 3000
const port = process.argv[2] || 9001;

const config = JSON.parse(fs.readFileSync('appconfig.json', 'utf8'));

http.createServer(function (request, response) {

    if (request.url.startsWith("/components")) {
        serveComponent(request, response);
    } else {
        tunnelInsightRequest(request, response);
    }
}).listen(parseInt(port));

function tunnelInsightRequest(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log(`${request.method} ${request.url}`);

    if (config.isMock) {
        mock.handleRequest(request, response);
    } else {
        httpntlm.get({
            url: config.baseUrl + request.url,
            username: config.user,
            password: config.password,
            workstation: '',
            domain: config.domain,
            binary: true
        }, function (err, res) {
            if (err) return err;

            console.log(res.headers);
            console.log(res.body);
            response.setHeader('Content-Type', res.headers['content-type']);
            response.end(res.body);
        });
    }
}

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
