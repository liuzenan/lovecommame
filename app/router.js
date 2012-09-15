define([
  // The main application
  "app",

  // Libs
  "jquery",
  "backbone",

  // Modules
  "modules/postcard",
  "modules/user"
],

function(app,$,Backbone,Postcard, User) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "signup" : "signUp",
      "wall" : "getWall",
      "postcard/:id" : "getPostcard",
      "create" : "createPostCard",
      "*other" : "defaultRoute"
    },

    index: function() {

      console.log('before');
      app.useLayout("login").setViews({
        "#container": new Postcard.Views.Index()
      }).render();

      console.log('after');
    },

    signUp: function() {

    },

    getWall: function(){

    },

    getPostcard: function(){

    },

    createPostCard: function(){

    },

    defaultRoute: function(other){
      console.log('default route');
    },

    initialize: function(){
      this.user = new User.Model();
      this.postcard
    }

  });

  return Router;

});
