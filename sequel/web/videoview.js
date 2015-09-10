var Backbone = require('backbone');
var _ = require('underscore');
var jQuery = require('jquery');

Backbone.$ = jQuery;

VideoView = Backbone.View.extend({
    el: '#video',
    path: null,
    name: null,
    template: require('./templates/video.tpl'),
    
    initialize: function(obj) {
	// Ensure our methods keep the `this` reference to the view itself
	_.bindAll(this, 'render');
	this.name = obj.name;
	this.path = obj.path;
    },

    render: function() {
	var obj = {};
	obj.name = this.name;
	obj.path = this.path;

        this.$el.html(this.template(obj));

        return this;
    }
});

exports.VideoView = VideoView;
