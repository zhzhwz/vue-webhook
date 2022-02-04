const http = require('http');
const server = http.createServer(function(request, response) {
    console.log(request.method.req.url);
    if (request.method == 'POST' && req.url == '/webhook') {
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
