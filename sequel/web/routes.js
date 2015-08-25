var Backbone = require('backbone');
var jQuery = require('jquery');
var models = require('./models.js');
var views = require('./views.js');

var Router = Backbone.Router.extend({
    routes: {
	'': 'index'  // At first we display the index route
    },

    index: function() {
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

	var list = new models.BlobList();
	list.fetch();

	// Pass the collection of people to the view
	var view = new views.BlobList({
	    collection: list
	});

	// And render it
	view.render();

	// Example of adding a new person afterwards
	// This will fire the 'add' event in the collection
	// which causes the view to re-render
	// people.add([
	//     {
	//       firstname: 'Zaphod',
	//       lastname: 'Beeblebrox'
	//     }
	//     ]);
    }
});

jQuery(document).ready(function() {
    // When the document is ready we instantiate the router
    var router = new Router();

    // And tell Backbone to start routing
    Backbone.history.start();
});
