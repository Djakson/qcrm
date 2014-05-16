static_server = require('node-static')

file = new static_server.Server('./node_modules/grunt-docular/node_modules/docular/lib/generated')

require('http').createServer((request, response) ->
    request.addListener('end', () ->
        file.serve(request, response)
    ).resume()
).listen(8080);
