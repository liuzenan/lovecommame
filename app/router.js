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
      "wall" : "receivedWall",
      "wall/sent" : "sentWall",
      "wall/public" : "publicWall",
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

    receivedWall: function(){
      this.reset();
      app.useLayout("wall").setViews({
        '.postcardList' : new Postcard.Views.WallList({
          collection: this.recPos,
          type:"rec"
        })
      }).render();
      this.recPos.fetch();
      this.allPos.fetch();

    },

    sentWall:function(){
      this.reset();
      app.useLayout("wall").setViews({
        '.postcardList' : new Postcard.Views.WallList({
          collection: this.senPos,
          type:"sen"
        })
      }).render();

      this.senPos.fetch();
    },

    publicWall : function(){
    },

    archive : function(){
      this.reset();
      app.useLayout("archive").setViews({
        '.postcardList' : new Postcard.Views.ArchiveList({collection: this.arcPos})
      }).render();
    },

    viewPostcard: function(id){
      console.log(this.allPos.get(id));
      app.useLayout("viewpostcard").setViews({
        '.viewpostcard' : new Postcard.Views.Detail({model: this.allPos.get(id)})
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
       this.senPos.reset();
    //  this.drafts.reset();
     // this.newPostcard.reset();
     // this.friends.reset();
      app.active = false;
    },

    initialize: function(){
      Backbone.LayoutManager.configure({
        manage: true
      });
      this.user = new User.Model();
      this.allPos = new Postcard.Collection.All();
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
