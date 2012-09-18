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
      this.reset();
      app.useLayout("login").setViews({
        ".container" : new User.Views.Login({model: this.user})
      }).render();
    },

    signup: function() {
      this.reset();
      app.useLayout("login").setViews({
        ".container" : new User.Views.Signup({model: this.user})
      }).render();
    },

    publicWall: function(){
      this.reset();
      app.useLayout("wall").setViews({
        '.postcardList' : new Postcard.Views.WallList({collection: this.recPos})
      }).render();

      this.recPos.fetch();
    },

    sentWall:function(){
      this.reset();
    },

    receivedWall : function(){
      this.reset();
    },

    archive : function(){
      this.reset();
      app.useLayout("archive").setViews({
        '.postcardList' : new Postcard.Views.ArchiveList({collection: this.arcPos})
      }).render();
    },

    viewPostcard: function(id){
      this.reset();
      app.useLayout("postcard").setViews({
        '.container' : new Postcard.Views.Detail({collection: this.arcPos})
      }).render();
    },

    compose: function(){
      this.reset();
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
      app.router.go("");
    },

    // Shortcut for building a url.
    go: function() {
      return this.navigate(_.toArray(arguments).join("/"), true);
    },

    reset: function(){
     // this.user.reset();
      this.recPos.reset();
    //  this.drafts.reset();
     // this.newPostcard.reset();
     // this.friends.reset();
      app.active = false;
    },

    initialize: function(){
      this.user = new User.Model();
      //received postcards
      this.recPos = new Postcard.Collection.Wall();
      //sent postcards
      this.senPos = new Postcard.Collection.Sent();
      //archived postcards
      this.arcPos = new Postcard.Collection.Archive();
      //draft postcards
      this.draPos = new Postcard.Collection.Draft();
      //create new postcards
      this.newPos = new Postcard.Model();
      //contacts
      this.friends = new Friend.Collection();
    }

  });

  return Router;

});
