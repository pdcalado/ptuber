var Backbone = require('backbone');
var jQuery = require('jquery');
var _ = require('underscore');
var models = require('./models.js');
var contactview = require('./contactview.js');
var tableview = require('./tableview.js');
var container = require('./containerview.js');
var video = require('./videoview.js');

Backbone.$ = jQuery;
$ = jQuery;

var Router = Backbone.Router.extend({
    container: null,
    list: null,
    cview: null,
    tview: null,
    vview: null,

    initialize: function() {
	this.container = new container.ContainerView({ el: $("#AppContainer") });
    },
    
    routes: {
	'': 'tube',  // At first we display the index route
	'table': 'table',
	'video': 'video'
    },

    tube: function() {
	// Initialize a list of blobs
	// In this case we provide an array, but normally you'd
	// instantiate an empty list and call people.fetch()
	// to get the data from your backend
	// var list = new models.BlobList([
	//   {
	//     id: 'deadbeef',
	//       name: 'TheWho',
	// 	  password: 'whohebe'
	//   },
	//   {
	//     id: 'beefdead',
	//       name: 'WhoThe',
	// 	  password: 'hebewho'
	//   }
	//   ]);

	if (this.list === null) {
	    this.list = new models.BlobList();
	    this.list.fetch();
	}

	// Pass the collection of people to the view
	// var view = new views.BlobList({
	if (this.cview === null) {
	    this.cview = new contactview.ContactList({
		collection: this.list
	    });
	}

	// And render it
	this.container.myChildView = this.cview;
	this.container.render();
    },

    table: function() {
	if (this.list === null) {
	    this.list = new models.BlobList();
	    this.list.fetch();
	}

	// Pass the collection of people to the view
	// var view = new views.BlobList({
	if (this.tview === null) {
	    this.tview = new tableview.BlobList({
		collection: this.list
	    });
	}

	// And render it
	this.container.myChildView = this.tview;
	this.container.render();
    },

    video: function() {
	if (this.list === null) {
	    this.list = new models.BlobList();
	    this.list.fetch();
	}

	// Pass the collection of people to the view
	// var view = new views.BlobList({
	if (this.vview === null) {
	    this.vview = new video.VideoView({
		path: "./video/",
		name: ""
	    });
	}

	// And render it
	this.container.myChildView = this.vview;
	this.container.render();
    }
});

jQuery(document).ready(function() {
    // When the document is ready we instantiate the router
    var router = new Router();

    // And tell Backbone to start routing
    Backbone.history.start();
});
