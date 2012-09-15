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

      }).render();
    },

    signUp: function() {
      console.log("signup");
      app.useLayout("login").setViews({

      })

    },

    wall: function(){

    },

    postcard: function(id){

    },

    create: function(){

    },

    defaultRoute: function(other){
      console.log('default route');
    },

    initialize: function(){
      this.user = new User.Model();
      this.postcards = new Postcard.Collection();
      this.newPostcard = new Postcard.Model();
      this.friends = new Friend.Collection();
    }

  });

  return Router;

});
