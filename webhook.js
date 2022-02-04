const http = require('http');
const server = http.createServer(function(request, response) {
    console.log(request.method, request.url);
    if (request.method == 'POST' && request.url == '/webhook') {
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
