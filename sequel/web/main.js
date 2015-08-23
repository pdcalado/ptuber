var AppView = Backbone.View.extend({
    // el - stands for element. Every view has a element associate in with HTML
    //      content will be rendered.
    el: '#container',
    // template which has the placeholder 'who' to be substitute later
    template: _.template("<h3>Hello <%= who %></h3>"),
    // It's the first function called when this view it's instantiated.
    initialize: function(){
        this.render();
    },
    // $el - it's a cached jQuery object (el), in which you can use jQuery functions
    //       to push content. Like the Hello World in this case.
    render: function(){
        this.$el.html(this.template({who: 'User!'}));
    }
});

var appView = new AppView();

var app = {};
app.Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

app.TodoList = Backbone.Collection.extend({
    model: app.Todo,
    localStorage: new Store("backbone-todo")
});

// instance of the Collection
app.todoList = new app.TodoList();

var todo = new app.Todo({title: 'Learn Backbone.js', completed: false}); // create object with the attributes specified.
console.log(todo.get('title')); // "Learn Backbone.js" 
console.log(todo.get('completed')); // false
console.log(todo.get('created_at')); // undefined
console.log(todo.set('created_at', Date()));
console.log(todo.get('created_at')); // "Wed Sep 12 2012 12:51:17 GMT-0400 (EDT)"
