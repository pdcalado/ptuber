var Backbone = require('backbone');
var jQuery = require('jquery');

Backbone.$ = jQuery;

var ContainerView = Backbone.View.extend({
    myChildView: null,
    
    render: function() {
        this.$el.html("PApp Area"); 

	this.myChildView.render();

        this.$el.append(this.myChildView.$el); 
        return this;
    }
});

exports.ContainerView = ContainerView;
