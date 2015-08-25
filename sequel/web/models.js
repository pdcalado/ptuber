var Backbone = require('backbone');

// Blob model
Blob = Backbone.Model.extend({
    defaults: {
        id: "",
        name: "",
	password: "",
	path: "",
	upath: "",
	upassword: "",
	thumbs: ""
    }
});

// Blob collection
BlobList = Backbone.Collection.extend({
    model: Blob,
    url: "http://localhost:3000/list"
});

exports.Blob = Blob;
exports.BlobList = BlobList;
