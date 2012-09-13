define([
  // Libraries.
  "zepto",
  "lodash",
  "backbone",

],

function($, _, Backbone){


    var M = M || {};

    M.TextStyle = Backbone.Model.extend({

        defaults: {
            fontSize: 18,
            fontFamily: 'Times New Roman', // to be determined
            fontColor: "#000000"
        },

        changeSize: function( size ){
            this.set({ fontSize : size });
        },

        changeFamily: function( family ){
            this.set({fontFamily : family});
        },
        
        changeColor: function( color ){
            this.set({fontColor : color});
        }
    });    

    M.PostcardText = Backbone.Model.extend({
        defaults: {
            textContent: ''
        },

        initialize: function(){
            textStyle = new M.TextStyle();
            this.textStyle.parent = this;
        },

        changeContent: function( content ){
            this.set({ textContent : content });
        },

        changeTextColor: function( color ){
            this.get("textStyle").changeColor(color);
        },

        changeTextSize: function( size ){
            this.get("textStyle").changeSize(size);
        },

        changeTextFamily: function( family ){
            this.get("textStyle").changeFamily(family);
        }
    });



    M.PostcardPhoto = Backbone.Model.extend({
        defaults: {
            photoSrc: "", // local source to be filled up
            photoWidth: 800, // to be determined by Gia
            photoHeight: 600,
            photoEffect: 1
        },

        changeSrc: function( source ){
            this.set({photoSrc : source});
        },

        changeEffect: function( effect ){
            this.set({photoEffect : effect});
        }
    });

    M.Postcard = Backbone.Model.extend({
        defaults: {
            postcardSender : '', //sender's id or sender's email address
            postcardReceiver : '', // receiver's address
            postcardTemplate : 1,
            postcardInSync : false
        },

        initialize: function(){
            this.postcardText = new M.PostcardText();
            this.postcardText.parent = this;
            postcardPhoto = new M.PostcardPhoto();
            this.postcardPhoto.parent = this;
        },

        changeTextContent: function( content ){
            this.get("postcardText").changeContent(content);
        },

        changeTextColor: function( color ){
            this.get("postcardText").changeTextColor(color);
        },

        changeTextFamily: function( family ){
            this.get("postcardText").changeTextFamily(family);
        },

        changeTextSize: function( size ){
            this.get("postcardText").changeTextSize(size);
        },

        changePhotoSrc: function( src ){
            this.get("postcardPhoto").changeSrc(src);
        },

        changePhotoEffect: function( effect ){
            this.get("postcardPhoto").changeEffect(effect);
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

    M.User = Backbone.Model.extend({
        // storing the user information
        // user id
        // user name
        // user email
        //  

    });

    return M;
}
);
