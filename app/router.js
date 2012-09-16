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
      "signup" : "signup",
      "wall" : "publicWall",
      "wall/sent" : "sentWall",
      "wall/received" : "receivedWall",
      "archive" : "archive",
      "postcard/:id" : "viewPostcard",
      "compose" : "compose",
      "compose/text" : "composeText",
      "compose/photo" : "composePhoto",
      "compose/send" : "send",
      "*other" : "defaultRoute"
    },

    index: function() {

      console.log('index');
      app.useLayout("login").setViews({
        ".container" : new User.Views.Login({model: this.user})
      }).render();
    },

    signup: function() {
      console.log("signup");
      app.useLayout("login").setViews({
        ".container" : new User.Views.Signup({model: this.user})
      }).render();
    },

    publicWall: function(){
      console.log("wall");
      app.useLayout("wall").setViews({
        '.postcardList' : new Postcard.Views.WallList({collection: this.recPos})
      }).render();
    },

    sentWall:function(){

    },

    receivedWall : function(){

    },

    archive : function(){
      console.log("archive");
      app.useLayout("archive").setViews({
        '.postcardList' : new Postcard.Views.ArchiveList({collection: this.arcPos})
      }).render();
    },

    viewPostcard: function(id){
      console.log("postcard");
      app.useLayout("postcard").setViews({
        '.container' : new Postcard.Views.Detail({collection: this.arcPos})
      }).render();
    },

    compose: function(){
      console.log("compose");
      app.useLayout("compose").setViews({
        '.container' : new Postcard.Views.DraftList({collection: this.draPos})
      }).render();
    },

    composeText: function(){

    },

    composePhoto: function(){

    },

    send: function(){

    },

    defaultRoute: function(other){
      console.log('default route');
      app.router.go("");
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
