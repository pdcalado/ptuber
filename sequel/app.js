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

//A sample GET request
dispatcher.onGet("/page1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Page One');
});

dispatcher.onGet("/sql", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/json'});

    var lines = [];

    function perRow(err, row) {
	var line = {};
	line.id = row.id;
	line.value = row.one;
	lines.push(line);
    }

    db.serialize(function() {
	db.each("SELECT rowid AS id, one FROM sample",
		perRow,
		function () {
		    res.end(JSON.stringify(lines));
		});
    });
});


//A sample POST request
dispatcher.onPost("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
