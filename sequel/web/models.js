var Backbone = require('backbone');

// Blob model
Blob = Backbone.Model.extend({
    defaults: {
        id: "",
        name: "",
	password: ""
    }
});

// Blob collection
BlobList = Backbone.Collection.extend({
    model: Blob,
    url: "/init.json"
});

exports.Blob = Blob;
exports.BlobList = BlobList;
