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
        //console.log(postcard);
        this.insertView(new Postcard.Views.WallItem({
          model: postcard
        }));
      }, this);
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

    events: {
      "click button" : "flip"
    },

    flip: function(ev){
      $(".card").css('-webkit-Transform', "rotateY(180deg)");
      $(".card").css('-moz-Transform', "rotateY(180deg)");
    },

    afterRender: function(){
      $(".card").bind("tapone", function(e){
        alert("check"); // apply gesture here to flip the postcard
      }); 
    }
  });

  //to be implemented
  Postcard.Views.EditText = Backbone.View.extend({
    template : "tpl_postcard_edit_text",
    tagName: "div",
    serialize: function(){
      return this.model.toJSON();
    }

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
