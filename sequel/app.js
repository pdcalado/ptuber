var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var dispatcher = require('httpdispatcher');
var process = require('process');

var PORT = 3000;

//so the program will not close instantly
process.stdin.resume();

function exitHandler(options, err) {
    console.log('leaving');
    db.close();

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

var db = new sqlite3.Database("mytempdb");

dispatcher.onGet("/sql", function(req, res) {
    var entries = [];
    var sqlerr = null;

    function perRow(err, row) {
	if (err !== null) {
	    sqlerr = err;
	    console.log(err);
	    return;
	}

	var entry = {};
	entry.id = row.id;
	entry.value = row.one;
	entries.push(entry);
    }

    db.serialize(function() {
	db.each("SELECT rowid AS id, one FROM sample",
		perRow,
		function (err) {
		    if (err !== null || sqlerr !== null) {
			console.log("Completion error: " + err);
			res.statusCode = 404;
			res.end();
			return;
		    }

		    res.writeHead(200, {'Content-Type': 'text/json'});
		    res.end(JSON.stringify(entries));
		});
    });
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
