var Backbone = require('backbone');
var _ = require('underscore');
var jQuery = require('jquery');

BlobListItem = Backbone.View.extend({
    // Each blob will be shown as a table row
    tagName: 'tr',

    initialize: function(options) {
	// Ensure our methods keep the `this` reference to the view itself
	_.bindAll(this, 'render');

	// If the model changes we need to re-render
	this.model.bind('change', this.render);
    },

    render: function() {
	// Clear existing row data if needed
	jQuery(this.el).empty();

	// Columns
	var cols = ['id', 'name', 'password', 'path',
		    'upath', 'upassword', 'thumbs'];

	var m = this.model;
	var element = this.el;

	// Write the table columns
	cols.forEach(function (cname) {
	    if (cname === 'id' && m.get(cname) === 'af592ab7a2e6544d10db7d7eac3398cd') {
		console.log("pass is: " + m.get('password'));
	    }

	    var v = jQuery('<td>' + m.get(cname) + '</td>');
	    jQuery(element).append(v);
	});

	return this;
    }
});

BlobList = Backbone.View.extend({
    // The collection will be kept here
    collection: null,

    // The people list view is attached to the table body
    el: 'tbody',

    initialize: function(options) {
	this.collection = options.collection;

	// Ensure our methods keep the `this` reference to the view itself
	_.bindAll(this, 'render');

	//Bind collection changes to re-rendering
	this.collection.bind('reset', this.render);
	this.collection.bind('add', this.render);
	// this.collection.bind('add', function(item) {
	//     var itemView = new BlobListItem({
	// 	model: item
	//     });

	//     var element = jQuery(this.el);
	//     element.append(itemView.render().el);

	//     return this;
	// });
	this.collection.bind('remove', this.render);
    },

    render: function() {
	var element = jQuery(this.el);
	// Clear potential old entries first
	element.empty();

	// Go through the collection items
	this.collection.each(function(item) {
	    // Instantiate a PeopleItem view for each
	    var itemView = new BlobListItem({
		model: item
	    });

	    // Render the PeopleView, and append its element
	    // to the table
	    element.append(itemView.render().el);
	});

	return this;
    }
});

exports.BlobListItem = BlobListItem;
exports.BlobList = BlobList;
