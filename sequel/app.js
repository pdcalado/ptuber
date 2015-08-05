var http = require('http');
var dispatcher = require('httpdispatcher');
var process = require('process');
var url = require('url');

var records = require('./records.js');

var PORT = 3000;

//so the program will not close instantly
process.stdin.resume();

console.log(typeof records.Records);

var recs = new records.Records("mytempdb");

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
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

dispatcher.onGet("/encrypted", function(req, res) {
    var queryData = url.parse(req.url, true).query;

    console.log("here with " + queryData.name + " " + queryData.id);

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
dispatcher.onPost("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});

//Create the server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
