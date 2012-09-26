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
      this.allPos.fetch();
      var current = this;
      app.useLayout("wall").setViews({
        '.postcardList' : new Postcard.Views.WallList({collection: this.recPos})
      }).render().then(function(el){
        if($('#postcardList').length>0){
          console.log("after render");
          if(current.scroller){
            current.scroller.destroy();
            current.scroller=null;
          }
          current.scroller = new iScroll('postcardList', {
            vScroll: false,
            vScrollbar: false
          });

          var seen = {};
          console.log(seen);
          $('.postcardWallList>li').each(function() {
            var txt = $(this).html();
            if (seen[txt])
              $(this).remove();
            else
              seen[txt] = true;
          });

          seen={};
        }
      });
      this.recPos.fetch({
        success:function(){
          if($('#postcardList').length>0){
            console.log("success");
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
          console.log("after render");
          if(current.scroller){
            current.scroller.destroy();
            current.scroller=null;
          }
          current.scroller = new iScroll('postcardList', {
            vScroll: false,
            vScrollbar: false
          });
        }
      });
      this.senPos.fetch({
        success:function(){
          if($('#postcardList').length>0){
            console.log("success");
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
    },

    archive : function(){
      this.reset();
      app.useLayout("archive").render();
      this.arcPos.fetch();
    },

    viewPostcard: function(id){
      console.log(this.allPos.get(id));
      var current = this;
      app.useLayout("viewpostcard").setViews({
        '.viewpostcard' : new Postcard.Views.Detail({model: this.allPos.get(id)})
      }).render().then(function(el){
        if($('#displaypostcard').length>0){
          console.log("after render");
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
      console.log(seen);
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
       //   console.log("success");
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
        }).render().then(function(el){
       // console.log("after render");
       if($('#createPostcardWrap').length>0){
        if(current.scroller){
          current.scroller.destroy();
          current.scroller=null;
        }
        current.scroller = new iScroll('createPostcardWrap', {
          zoom:true,
    vScroll: false,
    vScrollbar: false,
    hScrollbar: false,
    onBeforeScrollStart: function (e) {
      var target = e.target;
      while (target.nodeType != 1) target = target.parentNode;

      if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
        e.preventDefault();
    }
  });
      }
    });
      }else{
        console.log(this.draPos.get(id));
        this.newPos = this.draPos.get(id);
        app.useLayout("create").setViews({
          '.editor' : new Postcard.Views.EditText({model:this.newPos})
        }).render().then(function(el){
       // console.log("after render");
       if($('#createPostcardWrap').length>0){
        if(current.scroller){
          current.scroller.destroy();
          current.scroller=null;
        }
        current.scroller = new iScroll('createPostcardWrap', {
          zoom:true,
    vScroll: false,
    vScrollbar: false,
    hScrollbar: false,
    onBeforeScrollStart: function (e) {
      var target = e.target;
      while (target.nodeType != 1) target = target.parentNode;

      if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
        e.preventDefault();
    }
  });
      }
    });
      }
      
    },

    composePhoto: function(id){
      var current = this;
      if(id==0){
        app.useLayout("create").setViews({
          '.editor' : new Postcard.Views.UploadPhoto({model:this.newPos})
        }).render().then(function(el){
       // console.log("after render");
       if($('#createPostcardWrap').length>0){
        if(current.scroller){
          current.scroller.destroy();
          current.scroller=null;
        }
        current.scroller = new iScroll('createPostcardWrap', {
          vScroll: false,
          vScrollbar: false,
          hScrollbar: false
        });
      }
    });
      }else{
        console.log(this.draPos.get(id));
        this.newPos = this.draPos.get(id);
        app.useLayout("create").setViews({
          '.editor' : new Postcard.Views.UploadPhoto({model:this.newPos})
        }).render().then(function(el){
       // console.log("after render");
       if($('#createPostcardWrap').length>0){
        if(current.scroller){
          current.scroller.destroy();
          current.scroller=null;
        }
        current.scroller = new iScroll('createPostcardWrap', {
          vScroll: false,
          vScrollbar: false,
          hScrollbar: false
        });
      }
    });    
      }

    },

    send: function(){
      app.router.go("review");
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
