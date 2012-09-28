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
      "compose/text/:id" : "composeText",
      "compose/photo/:id" : "composePhoto",
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
      app.useLayout("signup").setViews({
        ".container" : new User.Views.Signup({model: this.user})
      }).render();
    },

    receivedWall: function(){
      this.reset();
      // if token and uid exist, meaning user is logged in
      // fetch data from server
      // otherwise use local storage
      if($.cookie("token") != null && $.cookie("uid") != null){
        alert("online");
        alert($.cookie("token"));
        alert($.cookie("uid"));
        this.allPos.fetch();
      }
      else{
        alert("use localStorage");
        
        this.allPos = JSON.parse(localStorage.getItem("all_postcard"));
      }
      var current = this;
      app.useLayout("wall").setViews({
        '.postcardList' : new Postcard.Views.WallList({collection: this.recPos})
      }).render().then(function(el){
        if($('#postcardList').length>0){
          if(current.scroller){
            current.scroller.destroy();
            current.scroller=null;
          }
          current.scroller = new iScroll('postcardList', {
            vScroll: false,
            vScrollbar: false
          });

          var seen = {};
          $('.postcardWallList>li').each(function() {
            var txt = $(this).html();
            if (seen[txt])
              $(this).remove();
            else
              seen[txt] = true;
          });

          seen={};

        $(".navigation>a").removeClass("current");
        $("#btninbox").addClass("current");
        }
      });
      this.recPos.fetch({
        success:function(){
          if($('#postcardList').length>0){
            if(current.scroller){
              current.scroller.destroy();
              current.scroller=null;
            }

            current.scroller = new iScroll('postcardList', {
              vScroll: false,
              vScrollbar: false
            });
          }
        }
      });

    },

    sentWall:function(){
      this.reset();
      var current = this;
      app.useLayout("wall").setViews({
        '.postcardList' : new Postcard.Views.WallList({collection: this.senPos})
      }).render().then(function(el){
        if($('#postcardList').length>0){
          if(current.scroller){
            current.scroller.destroy();
            current.scroller=null;
          }
          current.scroller = new iScroll('postcardList', {
            vScroll: false,
            vScrollbar: false
          });
        }
        $(".navigation>a").removeClass("current");
        $("#btnsent").addClass("current");
      });
      this.senPos.fetch({
        success:function(){
          if($('#postcardList').length>0){
            if(current.scroller){
              current.scroller.destroy();
              current.scroller=null;
            }

            current.scroller = new iScroll('postcardList', {
              vScroll: false,
              vScrollbar: false
            });
          }
        }
      });

    },

    publicWall : function(){
      this.reset();
        $(".navigation>a").removeClass("current");
        $("#btnpublic").addClass("current");
    },

    archive : function(){
      this.reset();
      var current = this;
      app.useLayout("archive").setViews({
        '#archiveList' : new Postcard.Views.ArchiveList({collection: this.arcPos})
      }).render();
      console.log("archive render");
      console.log(this.arcPos);
      this.arcPos.fetch({
        success : function(){
          console.log(current.arcPos.models);
        }
      });
    },

    viewPostcard: function(id){
      var current = this;
      app.useLayout("viewpostcard").setViews({
        '.viewpostcard' : new Postcard.Views.Detail({model: this.allPos.get(id)})
      }).render().then(function(el){
        if($('#displaypostcard').length>0){
          if(current.scroller){
            current.scroller.destroy();
            current.scroller=null;
          }
          current.scroller = new iScroll('displaypostcard', {
            vScroll: false,
            vScrollbar: false
          });
        }
      });
    },

    compose: function(){
      this.reset();
      var current = this;
      app.useLayout("compose").setViews({
        '.container' : new Postcard.Views.DraftList({collection: this.draPos})
      }).render().then(function(el){
       // console.log("after render");
       if($('#composeContainer').length>0){
        if(current.scroller){
          current.scroller.destroy();
          current.scroller=null;
        }
        current.scroller = new iScroll('composeContainer', {
          vScroll: false,
          vScrollbar: false,
          hScrollbar: false
        });

      var seen = {};
      $('.postcardDraftList>li').each(function() {
        var txt = $(this).html();
        if (seen[txt])
          $(this).remove();
        else
          seen[txt] = true;
      });

      seen={};
      }
    });

      this.draPos.fetch({
        success:function(){
       // console.log("success");
       if($('#composeContainer').length>0){
        if(current.scroller){
          current.scroller.destroy();
          current.scroller=null;
        }

        current.scroller = new iScroll('composeContainer', {
          vScroll: false,
          vScrollbar: false,
          hScrollbar: false
        });
      }
    }
  });
    },

    composeText: function(id){
      var current = this;
      if(id==0){
        app.useLayout("create").setViews({
          '.editor' : new Postcard.Views.EditText({model:this.newPos})
        }).render();
      }else{
        this.newPos = this.draPos.get(id);
        app.useLayout("create").setViews({
          '.editor' : new Postcard.Views.EditText({model:this.newPos})
        }).render();
      }
      
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
     this.draPos.reset();
     this.arcPos.reset();
     // this.newPos.reset();
     // this.friends.reset();
     app.active = false;
   },

   initialize: function(){
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