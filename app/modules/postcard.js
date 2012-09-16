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

  //to be implemented
  Postcard.Collection = Backbone.Collection.extend({
    model: Postcard.Model,
    cache: true,

    url: function(){
      return;
    },

    parse: function(obj){

    },

    initialize:function(models, options){
      if(options){

      }
    }
  });


  //to be implemented
  Postcard.Views.Wall = Backbone.View.extend({
    template: "tpl_wall",

    events: {
      "click #lomo" : "lomo",
      "click #sepia" : "sepia",
      "click #circlesmear" : "smear"
    },

    lomo: function(){
      var image = document.createElement("img");
      image.src = "assets/img/paris.jpg";
      $(image).load(function(){
        var canvas = document.getElementById('postcardcanvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        var context = canvas.getContext("2d");
        //Get data for the entire image
        var data = context.getImageData(0,0,canvas.width, canvas.height);
        $.JSManipulate.lomo.filter(data, {
          amount : 0.8,
          exposure : 5.5,
          level: 2.0
        }); 
        context.putImageData(data,0,0);
      });

    },

    sepia: function(){
      var image = document.createElement("img");
      image.src = "assets/img/paris.jpg";
      $(image).load(function(){
      var canvas = document.getElementById('postcardcanvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        var context = canvas.getContext("2d");
        //Get data for the entire image
        var data = context.getImageData(0,0,canvas.width, canvas.height);
        $.JSManipulate.sepia.filter(data); 
        context.putImageData(data,0,0);
      });
    },
    
    smear: function(){
      var image = document.createElement("img");
      image.src = "assets/img/paris.jpg";
      $(image).load(function(){
      var canvas = document.getElementById('postcardcanvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        var context = canvas.getContext("2d");
        //Get data for the entire image
        var data = context.getImageData(0,0,canvas.width, canvas.height);
        $.JSManipulate.circlesmear.filter(data); 
        context.putImageData(data,0,0);
      });
    }
  });

  //to be implemented
  Postcard.Views.Detail = Backbone.View.extend({

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
