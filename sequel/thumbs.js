fs = require('fs');
process = require('process');

search_path = "../../thumbs/";
result_path = "./img/thumbs/";

exports.getThumbs = function(id) {
    var thumbs = [];

    var files = fs.readdirSync(search_path);

    files.forEach(function(item) {
	res = item.match(id+"-*");
	if (res !== null) {
	    thumbs.push(res.input);
	}
    });

    if (thumbs.length > 0) {
	return thumbs.join();
    } else {
	return "";
    }
};
