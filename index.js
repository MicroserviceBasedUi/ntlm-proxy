const http = require('http');
const httpntlm = require('httpntlm');
const fs = require('fs');

// you can pass the parameter in the command line. e.g. node index.js 3000
const port = process.argv[2] || 9001;

const fileData = JSON.parse(fs.readFileSync('password.json', 'utf8'));
const userName = fileData.user;
const password = fileData.password;

http.createServer(function (request, response) {

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log(`${request.method} ${request.url}`);

    httpntlm.get({
        url: "https://insight.zuehlke.com/api/v1" + request.url,
        username: userName,
        password: password,
        workstation: '',
        domain: 'ads'
    }, function (err, res) {
        if (err) return err;

        console.log(res.headers);
        console.log(res.body);
        response.end(res.body);
    });
}).listen(parseInt(port));
console.log(`Server listening on port ${port}`);