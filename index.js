const http = require('http');
const fs = require('fs');
const tunnel = require('./insightTunnel');
const fileServer = require('./serveFiles');

// you can pass the parameter in the command line. e.g. node index.js 9001
const port = process.argv[2] || 9001;
const config = JSON.parse(fs.readFileSync('appconfig.json', 'utf8'));

http.createServer(function (request, response) {
    if (request.url.startsWith("/components")) {
        fileServer.serveFiles(request, response);
    } else {
        tunnel.tunnelInsightRequest(config, request, response);
    }
}).listen(parseInt(port));

console.log(`Running on port ${port} and proxying request to base URL ${config.baseUrl} with user ${config.user}; Serving files from 'components'`);
