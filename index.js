'option strict';

const http = require('http');
const httpntlm = require('httpntlm');
const fs = require('fs');
const mock = require('./mock.js');

// you can pass the parameter in the command line. e.g. node index.js 3000
const port = process.argv[2] || 9001;

const config = JSON.parse(fs.readFileSync('appconfig.json', 'utf8'));

http.createServer(function (request, response) {

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
}).listen(parseInt(port));

console.log(`Running on port ${port} and proxying request to base URL ${config.baseUrl} with user ${config.user}`);
