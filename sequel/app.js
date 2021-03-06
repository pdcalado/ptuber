var http = require('http');
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

function onGet(req, res, key, value, method) {
    function handleResult(err, obj) {
	if (err !== null || obj.id === undefined) {
	    res.writeHead(404);
	    res.end();
	    return;
	}

	res.writeHead(200, {'Content-Type': 'text/json'});
	res.end(JSON.stringify(obj));
    }

    recs[method](key, value, handleResult);
}

function onGetEncrypted(req, res) {
    var queryData = url.parse(req.url, true).query;

    if (queryData.name === undefined && queryData.id === undefined) {
	res.writeHead(404);
	res.end("Bad query, no name or id");
	return;
    }

    if (queryData.name === undefined) {
	onGet(req, res, "id", queryData.id, "getEncrypted");
	return;
    }

    if (queryData.id === undefined) {
	onGet(req, res, "name", queryData.name, "getEncrypted");
	return;
    }

    res.writeHead(404);
    res.end("Undefined state");
}

function onGetUploaded(req, res) {
    var queryData = url.parse(req.url, true).query;

    if (queryData.id === undefined) {
	res.writeHead(404);
	res.end("Bad query, no id");
	return;
    }

    onGet(req, res, "id", queryData.id, "getUploaded");
}

function onGetList(req, res) {
    function handleResult(err, list) {
	if (err !== null || list.length === 0) {
	    res.writeHead(404);
	    res.end();
	    return;
	}

	res.writeHead(200, {'Content-Type': 'text/json'});
	res.end(JSON.stringify(list));
    }

    recs.getList(handleResult);   
}

function onPostUploaded(req, res) {
    var data = "";

    req.on('data', function(chunk) {
	data += chunk.toString();
    });

    req.on('end', function() {

	var obj = JSON.parse(data);
	recs.setUploaded(obj, function (err) {
	    if (err !== null) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end("failed post: " + err);
		return;
	    }

	    res.writeHead(200, {'Content-Type': 'text/plain'});
	    res.end("Success");
	});
    });

    req.on('error', function(e) {
	res.writeHead(404);
	res.end(e);
	return;
    });
}

function onPostEncrypted(req, res) {
    var data = "";

    req.on('data', function(chunk) {
	data += chunk.toString();
    });

    req.on('end', function() {

	var obj = JSON.parse(data);
	recs.setEncrypted(obj, function (err) {
	    if (err !== null) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end("failed post: " + err);
		return;
	    }

	    res.writeHead(200, {'Content-Type': 'text/plain'});
	    res.end("Success");
	});
    });

    req.on('error', function(e) {
	res.writeHead(404);
	res.end(e);
	return;
    });
}

//Create the server
var server = http.createServer(function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', '*');

    // try {
    if (request.url.indexOf("/encrypted") === 0) {
	if (request.method === "GET") {
	    onGetEncrypted(request, response);
	} else if (request.method === "POST") {
	    onPostEncrypted(request, response);
	}

	return;
    }

    if (request.url.indexOf("/uploaded") === 0) {
	if (request.method === "GET") {
	    onGetUploaded(request, response);
	} else if (request.method === "POST") {
	    onPostUploaded(request, response);
	}

	return;
    }

    if (request.url.indexOf("/list") === 0) {
	if (request.method === "GET") {
	    onGetList(request, response);
	}

	return;
    }
    // }
    // catch (err) {
    // 	console.log("error: " + err);
    // }
});

server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:%s", PORT);
});
