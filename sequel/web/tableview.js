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
		    'upath', 'upassword'];

	var m = this.model;
	var element = this.el;

	// Write the table columns
	cols.forEach(function (cname) {
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
	_.bindAll(this, 'render', 'singleRender');

	//Bind collection changes to re-rendering
	this.collection.bind('reset', this.render);
	this.collection.bind('add', this.singleRender);
	this.collection.bind('remove', this.render);
    },

    singleRender: function(blob) {
	var element = jQuery(this.el);
	var itemView = new BlobListItem({
	    model: blob
	});

	// Render the PeopleView, and append its element
	// to the table
	element.append(itemView.render().el);
	return this;
    },

    render: function() {
	var element = jQuery(this.el);
	// Clear potential old entries first
	element.empty();

	// Go through the collection items
	this.collection.each(this.singleRender);

	return this;
    }
});

exports.BlobListItem = BlobListItem;
exports.BlobList = BlobList;
