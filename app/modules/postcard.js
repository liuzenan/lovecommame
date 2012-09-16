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
        defaults: {
            id: -1,
            postcardSender : "", // sender's address
            postcardSenderName : "", // sender's name
            postcardReceiver : '', // receiver's address
            postcardTemplate : 1,
            read : false,
            postcardInSync : false
        },

        initialize: function(){
            this.postcardText = new Postcard.PostcardText();
            this.postcardText.parent = this;
            this.postcardPhoto = new Postcard.PostcardPhoto();
            this.postcardPhoto.parent = this;
        },

        changeTextContent: function( content ){
            this.postcardText.changeContent(content);
        },

        changeTextColor: function( color ){
            this.postcardText.changeTextColor(color);
        },

        changeTextFamily: function( family ){
            this.postcardText.changeTextFamily(family);
        },

        changeTextSize: function( size ){
            this.postcardText.changeTextSize(size);
        },

        changePhotoSrc: function( src ){
            this.postcardPhoto.changeSrc(src);
        },

        changePhotoEffect: function( effect ){
            this.postcardPhoto.changeEffect(effect);
        },

        changeTemplate: function( template ){
            this.set({postcardTemplate : template});
        },

        changeReceiver: function( receiver ){
            this.set({postcardReceiver : receiver});
        },

        sync: function(){
            this.set({postcardInSync : true})
        },

        unsync: function(){
            this.set({postcardInSync : false});
        }
  });


  Postcard.Collection = Backbone.Collection.extend({
    model: Postcard.Model,
    cache: true
  });


  Postcard.Views.Item = Backbone.View.extend({
    template: "tpl_postcard_wall",
    tagName: "li"
  });


  Postcard.Views.List = Backbone.View.extend({
    tagName: "ul",
    className: "wall postcardList list",

    beforeRender: function(){
      this.$el.children().remove();
      this.collection.each(function(postcard){
        this.insertView(new Postcard.Views.Item({
          model: postcard
        }));
      }, this);
    },

    cleanup: function(){
      this.collection.off(null,null,this);
    },

    initialize:function(){
      this.collection.on("reset", this.render, this);
    }

  });


  Postcard.Views.Detail = Backbone.View.extend({
    template: "tpl_postcard_display",
    tagName: "div"
  });

  //to be implemented
  Postcard.Views.EditText = Backbone.View.extend({

  });

  Postcard.Views.UploadPhoto = Backbone.View.extend({

  });

  Postcard.Views.EditPhotoEffect = Backbone.View.extend({

  });

  Postcard.Views.Send = Backbone.View.extend({

  });

  // Required, return the module for AMD compliance
  return Postcard;

});
