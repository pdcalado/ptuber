var sqlite3 = require('sqlite3').verbose();
var thumbs = require('./thumbs.js');

Records = function Records(dbfile) {
    this.db = new sqlite3.Database(dbfile);
};

Records.prototype.close = function () {
    console.log("closing db");
    this.db.close();
};

var colNames = {};
colNames.encrypted = "id, name, password, path";
colNames.uploaded = "id, path, password, thumbs";

Records.prototype.serialize = function(query, parse, callback) {
    console.log(query);

    var dbref = this.db;

    dbref.serialize(function() {
	dbref.each(query,
		   parse,
		   function(err) {
		       if (err !== null) {
			   console.log("Completion error: " + err);
			   callback(err);
			   return;
		       }

		       callback(null);
		       return;
		   });
    });
};

Records.prototype.getRow = function(table, field, value, rowParse, callback) {
    var q = "SELECT " + colNames[table] + " FROM " + table + " WHERE " + field + " = '" + value + "'";

    this.serialize(q, rowParse, callback);
};

Records.prototype.getAll = function(table, rowParse, callback) {
    var q = "SELECT * FROM " + table;
    this.serialize(q, rowParse, callback);
};

Records.prototype.getList = function(callback) {
    var list = [];
    var sqlerr = null;

    var rec = this;

    function parseEnc(err, row) {
	if (err !== null) {
	    sqlerr = err;
	    console.log(err);
	    return;
	}

	list.push({id: row.id, name: row.name, password: row.password});
    }

    function result(err) {
	if (err !== null) {
	    callback(err, null);
	    return;
	}

	function parseUp(err, row) {
	    if (err !== null) {
		sqlerr = err;
		console.log(err);
		return;
	    }

	    list.forEach(function(item) {
		if (item.id === row.id) {
		    item.upath = row.path;
		    item.upassword = row.password;
		    item.thumbs = thumbs.getThumbs(item.id);
		}
	    });
	}

	function complete(err) {
	    if (err !== null) {
		callback(err, null);
		return;
	    }

	    callback(null, list);
	}

	rec.getAll("uploaded", parseUp, complete);
    }

    rec.getAll("encrypted", parseEnc, result);
};

// Get rows from encrypted table
Records.prototype.getEncrypted = function (field, value, callback) {
    var obj = {};
    var sqlerr = null;

    function parseEnc(err, row) {
	if (err !== null) {
	    sqlerr = err;
	    console.log(err);
	    return;
	}

	obj.id = row.id;
	obj.name = row.name;
	obj.password = row.password;
	obj.path = row.path;
    }

    function result(err) {
	if (err !== null) {
	    callback(err, null);
	    return;
	}

	callback(null, obj);
    }

    this.getRow("encrypted", field, value, parseEnc, result);
};

// Insert a row into encrypted table
Records.prototype.setEncrypted = function (row, callback) {
    var sqlerr = null;

    if (row.id === undefined ||
	row.name === undefined ||
	row.password === undefined) {
	callback("at least id, name and password must be provided");
	return;
    }

    var values = "'" + row.id + "', '" + row.name + "', '" + row.password + "'";
    if (row.path !== undefined) {
	values += ", '" + row.path + "'";
    } else {
	values += ", ''";
    }

    var q = "INSERT INTO encrypted VALUES (" + values + ")";

    console.log(q);

    this.db.run(q, [], function (err) {
	if (err !== null) {
	    console.log("Insertion error: " + err);
	    callback(err);
	    return;
	}

	callback(null);
    });
};

// Get rows from encrypted table
Records.prototype.getUploaded = function (field, value, callback) {
    var obj = {};
    var sqlerr = null;

    function parseUp(err, row) {
	if (err !== null) {
	    sqlerr = err;
	    console.log(err);
	    return;
	}

	obj.id = row.id;
	obj.path = row.path;
	obj.password = row.password;
	obj.thumbs = row.thumbs;
    }

    function result(err) {
	if (err !== null) {
	    callback(err, null);
	    return;
	}

	callback(null, obj);
    }

    this.getRow("uploaded", field, value, parseUp, result);
};

Records.prototype.setUploaded = function (row, callback) {
    var sqlerr = null;

    if (row.id === undefined ||
	row.path === undefined ||
	row.password === undefined ||
	row.thumbs === undefined) {
	callback("at least id, path and password must be provided");
	return;
    }

    var values = "'" + row.id + "', '" + row.path + "', '" + row.password + "'";
    if (row.thumbs !== undefined) {
	values += ", '" + row.thumbs + "'";
    } else {
	values += ", ''";
    }

    var q = "INSERT INTO uploaded VALUES (" + values + ")";

    console.log(q);

    this.db.run(q, [], function (err) {
	if (err !== null) {
	    console.log("Insertion error: " + err);
	    callback(err);
	    return;
	}

	callback(null);
    });
};

exports.Records = Records;
exports.Records.getEncrypted = Records.getEncrypted;
exports.Records.close = Records.close;
exports.Records.setEncrypted = Records.setEncrypted;
