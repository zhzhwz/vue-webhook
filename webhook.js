const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process')
const SECRET = '123456';
function sign(body) {
    return `sha1=` + crypto.createHmac('sha1', SECRET).update(body).digest('hex');
}
const server = http.createServer(function(request, response) {
    console.log(request.method, request.url);
    if (request.method == 'POST' && request.url == '/webhook') {
        let buffers = []
        request.on('data', function(buffer) {
            buffers.push(buffer);
        })
        request.on('end', function(buffer) {
            let body = Buffer.concat(buffers);
            let event = request.headers['x-github-event'];
            let signature = request.headers['x-hub-signature'];
            console.log('typeof event: ' + (typeof event));
            console.log('event: ' + event);
            console.log('sign from github: ' + signature);
            console.log('sign calced: ' + sign(body));
            if (signature !== sign(body)) {
                return response.end('Not Allowed');
            }
            console.log('Allowed');
            response.setHeader('Content-Type', 'application-json');
            response.end(JSON.stringify({ ok: true }));
            if (event == 'push') {
                console.log('event == push');
                let payload = JSON.parse(body);
                let child = spawn('sh', [`./${payload.repository.name}.sh`]);
                let buffers = [];
                child.stdout.on('data', function(buffer) {
                    buffers.push(buffer);
                });
                child.stdout.on('end', function(buffer) {
                    let log = Buffer.concat(buffers);
                    console.log(log);
                });
            }
        })
    }
    else {
        response.end('Not Found');
    }
});
server.listen(4000, function() {
    console.log('Listening 4000...');
})
