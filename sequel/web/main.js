/* jshint node: true */
'use strict';

var Backbone = require('backbone');

// window.$ = window.jQuery = Backbone.$ = jquery;

// window._ = require('underscore')
// window.page = require('page')

require('./routes.js');

// instance of the Collection
// app.blobList = new app.BlobList();

// app.blobList.fetch({ 
//     success: function() {
//         console.log("JSON file load was successful", app.blobList);
//     },
//     error: function(){
// 	console.log('There was some error in loading and processing the JSON file');
//     }
// });

// var AppView = Backbone.View.extend({
//     // el - stands for element. Every view has a element associate in with HTML
//     //      content will be rendered.
//     el: '#container',
//     // template which has the placeholder 'who' to be substitute later
//     template: _.template("<h3>Hello <%= who %></h3>"),
//     // It's the first function called when this view it's instantiated.
//     initialize: function(){
//         this.render();
//     },
//     // $el - it's a cached jQuery object (el), in which you can use jQuery functions
//     //       to push content. Like the Hello World in this case.
//     render: function(){
//         this.$el.html(this.template({who: 'User!'}));
// 	// this.$el.append(grid.render().el);
//     }
// });

// var appView = new AppView();
