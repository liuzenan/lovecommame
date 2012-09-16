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
        ".login" : new User.Views.Login({model: this.user})
      }).render();
    },

    signUp: function() {
      console.log("signup");
      app.useLayout("login").setViews({
        ".login" : new User.Views.Signup({model: this.user})
      }).render();
    },

    wall: function(path){
      console.log("wall");
      app.useLayout("wall").setViews({
        '.postcardList' : new Postcard.Views.List({collection: this.postcards})
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
      this.postcards.reset();
      this.drafts.reset();
      this.newPostcard.reset();
      this.friends.reset();
      app.active = false;
    },

    initialize: function(){
      this.user = new User.Model();
      //received postcards
      this.recPos = new Postcard.Collection();
      //sent postcards
      this.senPos = new Postcard.Collection();
      //archived postcards
      this.arcPos = new Postcard.Collection();
      //draft postcards
      this.draPos = new Postcard.Collection();
      //create new postcards
      this.newPos = new Postcard.Model();
      //contacts
      this.friends = new Friend.Collection();
    }

  });

  return Router;

});
