define([
  "app",

  // Libs
  "backbone"
],

function(app, Backbone) {

  // Create a new module
  var Postcard = app.module();   

  Postcard.PostcardText = Backbone.Model.extend({
        defaults: {
            textContent: '',
            textStyle: ''
        },

        changeContent: function( content ){
            this.set({ textContent : content });
        },
  });

  Postcard.PostcardPhoto = Backbone.Model.extend({
        defaults: {
            photoSrc: '', // local source to be filled up
            photoWidth: 800, // to be determined by Gia
            photoHeight: 600,
            photoTop: 0,
            photoLeft: 0,
            photoEffect: 0
        },

        changeSrc: function( source ){
            this.set({photoSrc : source});
        },

        changeEffect: function( effect ){
            this.set({photoEffect : effect});
        }
  });

  Postcard.Model = Backbone.Model.extend({
    idAttribute: "pid"
  });

  Postcard.Collection = Backbone.Collection.extend({
    url : "http://ec2-54-251-19-5.ap-southeast-1.compute.amazonaws.com/api.php/user/1",
    cache: true,
    model: Postcard.Model
  });


  Postcard.Collection.Wall = Postcard.Collection.extend({
    parse: function(object){
      return object.unread.concat(object.read);
    }
  });

  //to be implemented
  Postcard.Collection.Archive = Postcard.Collection.extend({
    parse: function(object){
      return object.archived;
    }
  });

  //TODO
  Postcard.Collection.Sent = Postcard.Collection.extend({
    parse: function(object){
      return object.sent;
    }
  });

  //TODO
  Postcard.Collection.Draft = Postcard.Collection.extend({
    parse: function(object){
      return object.draft;
    }
  });

  //TODO
  Postcard.Collection.All = Postcard.Collection.extend({
    parse: function(object){
      return object.draft.concat(object.sent).concat(object.read).concat(object.unread).concat(object.draft);
    }
  });

  //wall page post card views
  Postcard.Views.WallItem = Backbone.View.extend({
    tagName:"li",
    template: "tpl_postcard_wall",
    serialize: function(){
      return this.model.toJSON();
    },

    afterRender: function(){
      this.postcardResize();
      this.intervals = setInterval(flipBack, 2000);
      var current = this;
      function flipBack(){
        var num = Math.random()*10;
        if(num<2){
          $(current.el).find('a').toggleClass('flip');
        }
      }
    },

    postcardResize: function(){
      var containerHeight =  $(window).height()*0.75;
      var postcardH, postcardW;
     if($(window).height()>$(window).width()){
        postcardH = (containerHeight-20)/2;
     }else{
        postcardH = containerHeight - 10;
     }
     postcardW = postcardH*1.5;
     $(this.el).width(postcardW);
     $(this.el).height(postcardH);
    }
  });

  Postcard.Views.List = Backbone.View.extend({
    tagName:"ul",

    initialize: function() {
      this.collection.on("reset", this.render, this);
    }

  });


  Postcard.Views.WallList = Postcard.Views.List.extend({
    
    className: "postcardWallList",

    beforeRender: function(){
      this.$el.children().remove();
      this.collection.each(function(postcard){
        this.insertView(new Postcard.Views.WallItem({
          model: postcard
        }));
      }, this);
    },

    afterRender: function(){
      this.resizePostcard();
      if(app.router.scroller){
        app.router.scroller.refresh();
      }
    },

    remove: function(){
      console.log("destory");
      if(this.scroller){
      this.scroller.destroy();
      this.scroller=null;
    }
    },

    resizePostcard: function(){
      var noOfPostcards = this.collection.size();
      console.log("collection size: " + noOfPostcards);
      //$('.postcardWallList').css('width', noOfPostcards*240 + "px");
     // $('.postcardWallList').css('width', (noOfPostcards*250/2)+"px");
      var containerHeight =  $(window).height()*0.75;
      var postcardH, postcardW;
     if($(window).height()>$(window).width()){
        postcardH = (containerHeight-20)/2;
        postcardW = postcardH*1.5;
        $('.postcardWallList').width((noOfPostcards+1)*(postcardW+10)/2);
     }else{
        postcardH = containerHeight - 10;
        postcardW = postcardH*1.5;
        $('.postcardWallList').width(noOfPostcards*(postcardW+10)+60);
     }
    }
  });

  Postcard.Views.ArchiveItem = Backbone.View.extend({
    tagName:"li",
    template: "tpl_postcard_archive",
    serialize: function(){
      return this.model.toJSON();
    }
  });


  Postcard.Views.ArchiveList = Postcard.Views.List.extend({
    className: "postcardArchiveList",

    beforeRender: function(){
      this.$el.children().remove();
      this.collection.each(function(postcard){
        this.insertView(new Postcard.Views.ArchiveItem({
          el: $(".postcardArchiveList"),
          model: postcard
        }));
      }, this);
    }
  });


  Postcard.Views.DraftItem = Backbone.View.extend({
    tagName:"li",
    template: "tpl_postcard_draft",
    serialize: function(){
      return this.model.toJSON();
    }
  });


  Postcard.Views.DraftList = Postcard.Views.List.extend({
    className: "postcardDraftList",

    beforeRender: function(){
      this.$el.children().remove();
      this.collection.each(function(postcard){
        this.insertView(new Postcard.Views.DraftItem({
          model: postcard
        }));
      }, this);
    }
  });

  //display page postcard views
  Postcard.Views.Detail = Backbone.View.extend({
    template: "tpl_postcard_display",
    tagName: "div",
    serialize: function(){
      return this.model.toJSON();
    },

    afterRender: function(){
      var windowHeight =  $(window).height();
      var windowWidth = $(window).width();
      $("#displaypostcard>div").width(windowHeight*0.7*1.5+100);
      $(".display.postcard.container").height(windowHeight*0.7).width(windowHeight*0.7*1.5);
      var current = this;
      $(current.el).bind("tapone", function(e){
        $(current.el).find('.card').toggleClass('flip');
      }); 

      $("#displaypostcard").css("overflow","visible");
    }
  });

  //to be implemented
  Postcard.Views.EditText = Backbone.View.extend({
    template : "tpl_postcard_edit_text",
    tagName: "div",
    serialize: function(){
      return this.model.toJSON();
    },

    events: {
      "click .send" : "uploadNew"
    },

    uploadNew: function(ev){
      alert("send clicked");

      var testPostcard = new Postcard.Model({ 
        body: "testing message",
        body_effect: 2,
        postcard_effect: 0,
        uid_from: 1,
        status: 2,
        mail: "test@gmail.com",
        top: 0,
        left: 0,
        width: 300,
        height: 200,
        data_url: "this is some dummy data",
        photo_effect: 2
      });

      alert("test postcard created");
      
      testPostcard.save();

      alert("testPostcard saved");
      // create a new instance of postcard
      // and upload to server
    },
  });

  Postcard.Views.UploadPhoto = Backbone.View.extend({
    template: "tpl_postcard_edit_photo",
    tagName: "div",
    serialize:function(){
      return this.model.toJSON();
    }
  });
  
  Postcard.Views.Send = Backbone.View.extend({

  });

  // Required, return the module for AMD compliance
  return Postcard;
});
