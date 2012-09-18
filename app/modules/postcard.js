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

  Postcard.Model = Backbone.Model.extend();

  Postcard.Collection = Backbone.Collection.extend({
    url : "http://ec2-54-251-19-5.ap-southeast-1.compute.amazonaws.com/api.php/user/2",
    cache: true,
    model: Postcard.Model
  });


  Postcard.Collection.Wall = Postcard.Collection.extend({
    parse: function(object){
      return object.read;
    }
  });

  //to be implemented
  Postcard.Collection.Archive = Postcard.Collection.extend({
    parse: function(object){
      return object.read;
    }
  });

  //TODO
  Postcard.Collection.Sent = Postcard.Collection.extend({

  });

  //TODO
  Postcard.Collection.Draft = Postcard.Collection.extend({

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

    cleanup: function() {
      this.collection.off(null, null, this);
    },

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
      $('#archive').click(function(){
        app.router.go("archive");
      });
      $('#compose').click(function(){
        app.router.go("compose");
      });
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
          model: postcard
        }));
      }, this);
    },

    afterRender: function(){
      $('#archive').click(function(){
        app.router.go("archive");
      });
      $('#compose').click(function(){
        app.router.go("compose");
      });
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
    },

    afterRender: function(){
      $('#archive').click(function(){
        app.router.go("archive");
      });
      $('#compose').click(function(){
        app.router.go("compose");
      });
    }
  });

  //display page postcard views
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
