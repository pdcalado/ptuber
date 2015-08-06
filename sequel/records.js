var sqlite3 = require('sqlite3').verbose();

Records = function Records(dbfile) {
    this.db = new sqlite3.Database(dbfile);
}

Records.prototype.close = function () {
    console.log("closing db");
    this.db.close();
};

var colNames = "id, name, password, path";

// Get rows from encrypted table
Records.prototype.getEncrypted = function (field, value, callback) {
    var sqlerr = null;
    var obj = {};

    function rowParse(err, row) {
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

    var q = "SELECT " + colNames + " FROM encrypted WHERE " + field + " = '" + value + "'";
    console.log(q);

    var dbref = this.db;

    dbref.serialize(function() {
	dbref.each(q,
		   rowParse,
		   function(err) {
		       if (err !== null || sqlerr !== null) {
			   console.log("Completion error: " + err + " " + sqlerr);
			   callback(err + " " + sqlerr, null);
			   return;
		       }

		       callback(null, obj);
		       return;
		   });
    });
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
	    callback(err);
	    console("Insertion error: " + err)
	    return;
	}

	callback(null);
    });
};

exports.Records = Records;
exports.Records.getEncrypted = Records.getEncrypted;
exports.Records.close = Records.close;
exports.Records.setEncrypted = Records.setEncrypted;
