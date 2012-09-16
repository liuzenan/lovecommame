define([
  // The main application
  "app",
  // Modules
  "modules/postcard",
  "modules/user",
  "modules/friend",
],

function(app, Postcard, User, Friend) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "signup" : "signUp",
      "wall" : "wall",
      "postcard/:id" : "postcard",
      "create" : "create",
      "*other" : "defaultRoute"
    },

    index: function() {

      console.log('index');
      app.useLayout("login").setViews({
        "#container" : new User.Views.Login({model: this.user})
      }).render();
    },

    signUp: function() {
      console.log("signup");
      app.useLayout("login").setViews({
        "#container" : new User.Views.Login({model: })
      }).render();
    },

    wall: function(path){
      app.useLayout("wall").setViews({
        '#wallwarp' : new Postcard.Views.Wall()
      }).render();

    },

    postcard: function(id){

    },

    create: function(){

    },

    defaultRoute: function(other){
      console.log('default route');

    },

    // Shortcut for building a url.
    go: function() {
      return this.navigate(_.toArray(arguments).join("/"), true);
    },

    reset: function(){
      this.user.reset();
      this.postcareds.reset();
      this.drafts.reset();
      this.newPostcard.reset();
      this.friends.reset();
      app.active = false;
    },

    initialize: function(){
      this.user = new User.Model();
      this.postcards = new Postcard.Collection();
      this.drafts = new Postcard.Collection();
      this.newPostcard = new Postcard.Model();
      this.friends = new Friend.Collection();
    }

  });

  return Router;

});
