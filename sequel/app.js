var http = require('http');
var dispatcher = require('httpdispatcher');
var process = require('process');
var url = require('url');

var records = require('./records.js');

var PORT = 3000;

//so the program will not close instantly
process.stdin.resume();

var recs = new records.Records("storedb");

var closed = 0;

function exitHandler(options, err) {
    if (closed === 0) {
	console.log('leaving');
	recs.close();
	closed = 1;
    }

    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

//Lets use our dispatcher
function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
        //Dispatch
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

dispatcher.onGet("/encrypted", function(req, res) {
    var queryData = url.parse(req.url, true).query;

    if (queryData.name === undefined && queryData.id === undefined) {
	res.statusCode = 404;
	res.end("Bad query, no name or id");
	return;
    }

    function handleResult(err, obj) {
	if (err !== null) {
	    res.statusCode = 404;
	    res.end();
	    return;
	}

	res.writeHead(200, {'Content-Type': 'text/json'});
	res.end(JSON.stringify(obj));
    }

    if (queryData.name === undefined) {
	recs.getEncrypted("id", queryData.id, handleResult);
	return;
    }

    if (queryData.id === undefined) {
	recs.getEncrypted("name", queryData.name, handleResult);
	return;
    }

    res.statusCode = 404;
    res.end("Undefined state");
});


//A sample POST request
dispatcher.onPost("/encrypted", function(request, response) {
    console.log("right here");

    console.log("method " + request.method + " headers " + JSON.stringify(request.headers));
    console.log("url " + request.url);

    request.on('data', function(chunk) {
	console.log("Received body data:");
	console.log(chunk.toString());
    });

    request.on('end', function() {
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('Got Post Data');
    });

    request.on('error', function(e) {
	console.log("some error " + e);
    });
});

//Create the server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

var server2 = http.createServer(function (request, response) {
    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            if (body.length > 1e6)
                request.connection.destroy();
        });
        request.on('end', function () {
	    console.log(body);
	    response.end();
            // use post['blah'], etc.
        });
    }
});

server2.listen(PORT+1, function () {
    console.log("also listening at " + PORT + 1);
});
