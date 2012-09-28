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
      this.allPos.reset();
      // if token and uid exist, meaning user is logged in
      // fetch data from server
      // otherwise use local storage
      if($.cookie("token") != null && $.cookie("uid") != null){
        this.allPos.fetch();
      }
      else{
        alert("use localStorage");
        
        this.allPos = JSON.parse(localStorage.getItem("all_postcard"));

        alert(this.allPos.length);
        alert(localStorage.getItem("all_postcard"));
      }
      var current = this;
      app.useLayout("wall").setViews({
        '.postcardList' : new Postcard.Views.WallList({collection: this.recPos})
      }).render().then(function(){

      current.setScroller('postcardList');

      var seen = {};
      $('.postcardWallList>li').each(function() {
            var txt = $(this).html();
            if (seen[txt])
              $(this).remove();
            else
              seen[txt] = true;
      });

      $(".navigation>a").removeClass("current");
      $("#btninbox").addClass("current");

      });

      if($.cookie("uid") != null && $.cookie("token") != null){
        this.recPos.fetch({
          success:function(){
            current.setScroller('postcardList');
          }
        });
      }
      else{
        alert("get received from local");

        var unread = this.allPos.where({status: 1, uid_to: $.cookie("uid")});
        var read = this.allPos.where({status: 2, uid_to: $.cookie("uid")});

        alert(unread);
        alert(read);
        this.recPos = unread.concat(read);
      }  
    },

    setScroller : function(wrapper){
      var current= this;
      if($('#'+wrapper).length>0){
          if(current.scroller){
            current.scroller.destroy();
            current.scroller=null;
          }
          current.scroller = new iScroll(wrapper, {
            vScroll: false,
            vScrollbar: false,
            hScrollbar:false
          });
        }

    },

    sentWall:function(){
      this.reset();
      var current = this;
      app.useLayout("wall").setViews({
        '.postcardList' : new Postcard.Views.WallList({collection: this.senPos})
      }).render().then(function(el){
current.setScroller('postcardList');
        $(".navigation>a").removeClass("current");
        $("#btnsent").addClass("current");
      });

      if($.cookie("uid") != null && $.cookie("token") != null){
        this.senPos.fetch({
          success:function(){
            current.setScroller('postcardList');
          }
        });
      }
      else{
        alert("sentwall");
      }
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

      if($.cookie("uid") != null && $.cookie("token") != null){
        this.arcPos.fetch({
          success : function(){
            console.log(current.arcPos.models);
          }
        });
      }
      else{
        alert("archive");
      }  
    },

    viewPostcard: function(id){
      var current = this;
      app.useLayout("viewpostcard").setViews({
        '.viewpostcard' : new Postcard.Views.Detail({model: this.allPos.get(id)})
      }).render().then(function(el){
        current.setScroller('displaypostcard');
      });
    },

    compose: function(){
      this.reset();
      var current = this;
      app.useLayout("compose").setViews({
        '.container' : new Postcard.Views.DraftList({collection: this.draPos})
      }).render().then(function(el){
       // console.log("after render");
       current.setScroller('composeContainer');

      var seen = {};
      $('.postcardDraftList>li').each(function() {
        var txt = $(this).html();
        if (seen[txt]){
          $(this).remove();
        }
        else{
          seen[txt] = true;
        }
      });
    });

      if($.cookie("uid") != null && $.cookie("token") != null){
        this.draPos.fetch({
          success:function(){
            current.setScroller('composeContainer');
          }
        });
      }
      else{
        alert("draft");
      }  
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