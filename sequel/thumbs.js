fs = require('fs');
process = require('process');

search_path = "../../thumbs/";
result_path = "./img/thumbs/";

exports.getPreview = function(id) {
    files = fs.readdirSync(search_path);
    preview = null;

    files.forEach(function(item) {
	res = item.match(id+"-50.*");
	if (res !== null) {
	    preview = result_path + res.input;
	    return;
	}
    });

    return preview;
};

