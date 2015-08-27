var Backbone = require('backbone');
var _ = require('underscore');
var jQuery = require('jquery');

Backbone.$ = jQuery;

ContactItem = Backbone.View.extend({
    tagName: "article",
    className: "contact-container",
    template: require('./templates/contact.tpl'),

    initialize: function () {
	// Ensure our methods keep the `this` reference to the view itself
	_.bindAll(this, 'render');

	// If the model changes we need to re-render
	this.model.bind('change', this.render);
    },
    
    render: function () {
	// Clear existing row data if needed
	this.$el.empty();

        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }
});

ContactList = Backbone.View.extend({
    collection: null,

    el: '#contacts',
    
    initialize: function (options) {
	this.collection = options.collection;

	// Ensure our methods keep the `this` reference to the view itself
	_.bindAll(this, 'render', 'singleRender');

	//Bind collection changes to re-rendering
	this.collection.bind('reset', this.render);
	this.collection.bind('add', this.singleRender);
	this.collection.bind('remove', this.render);
    },

    singleRender: function(item) {
        var contactView = new ContactItem({
            model: item
        });

        jQuery(this.el).append(contactView.render().el);
    },
    
    render: function () {
        var that = this;
        _.each(this.collection.models, function (item) {
            that.renderContact(item);
        }, this);
    }
});

exports.ContactList = ContactList;
exports.ContactItem = ContactItem;
