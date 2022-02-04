const http = require('http');
const crypto = require('crypto');
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
            let signature = request.headers['x-github-signature'];
            if (signature !== sign(body)) {
                return response.end('Not Allowed');
            }
        })
        response.setHeader('Content-Type', 'application-json');
        response.end(JSON.stringify({ok: true}));
    }
    else {
        response.end('Not Found');
    }
});
server.listen(4000, function() {
    console.log('Listening 4000...');
})
