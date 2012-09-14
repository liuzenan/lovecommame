define([
  // Application.
  "app",

    // Libs
  "jquery",
  "backbone",

  "modules/example"
],

function(app,$,Backbone,Example) {

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
        "#container": new Example.Views.Index()
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
    }

  });

  return Router;

});
