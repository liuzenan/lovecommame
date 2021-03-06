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
    idAttribute: "pid",
    defaults:{
      pid: -1,
      status : -1
    }
  });

  Postcard.Collection = Backbone.Collection.extend({
    url : function(){
      return "http://54.251.37.19/api.php/user/" + $.cookie("uid") + "?token=" + $.cookie("token");
    },
    cache: false,
    model: Postcard.Model
  });

  Postcard.Collection.Wall = Postcard.Collection.extend({
    parse: function(object){
      if($.cookie("token") != null && $.cookie("uid") != null){
        return object.unread.concat(object.read);
      }
      else{
        var unread = app.router.allPos.where({status: 1, uid_to: $.cookie("uid")});
        var read = app.router.allPos.where({status: 2, uid_to: $.cookie("uid")});

        return unread.concat(read);
      }
    }
  });

  //to be implemented
  Postcard.Collection.Archive = Postcard.Collection.extend({
    parse: function(object){
      if($.cookie("token") != null && $.cookie("uid") != null){
        return object.archived;
      }
      else{
        // get from all postcard collection
      }
    }
  });

  //TODO
  Postcard.Collection.Sent = Postcard.Collection.extend({
    parse: function(object){
      if($.cookie("token") != null && $.cookie("uid") != null){
        return object.sent;
      }
      else{
        // get from all postcard collection
      }
    }
  });

  //TODO
  Postcard.Collection.Draft = Postcard.Collection.extend({
    parse: function(object){
      if($.cookie("token") != null && $.cookie("uid") != null){
        return object.draft;
      }
      else{
        // get from all postcard collection
      }
    }
  });

  Postcard.Collection.Public = Postcard.Collection.extend({
    parse: function(object){
      if($.cookie("token") != null && $.cookie("uid") != null){
        return object.public;
      }
      else{
        // get from all postcard collection
      }
    }
  })

  //TODO
  Postcard.Collection.All = Postcard.Collection.extend({
    parse: function(object){
      if($.cookie("token") != null && $.cookie("uid") != null){
        var temp = object.draft.concat(object.sent).concat(object.read).concat(object.unread).concat(object.draft).concat(object.public);

        // store postcard collection locally
        localStorage.setItem('all_postcard', JSON.stringify(temp));


        return temp;
      }
    }
  });

  //wall page post card views
  Postcard.Views.Item = Backbone.View.extend({
    tagName:"li",
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
      var containerHeight = $(window).height()*0.75;
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

  Postcard.Views.WallItem = Postcard.Views.Item.extend({
    template:"tpl_postcard_wall"
  });

  Postcard.Views.SentItem = Postcard.Views.Item.extend({
    template: "tpl_postcard_sent"
  });

  Postcard.Views.PublicItem = Postcard.Views.Item.extend({
    template: "tpl_postcard_public"
  });

  Postcard.Views.List = Backbone.View.extend({
    tagName:"ul",

    initialize: function() {
      this.collection.on("reset", this.render, this);
    },

    resizePostcard: function(){
      var numOfCards = $(".postcardWallList>li").length;
      var containerHeight = $(window).height();
      var containerWidth = $(window).width();
      var childlist = $(".postcardWallList>li");
      if(containerHeight<containerWidth){
        childlist.height(containerHeight*0.7);
        childlist.width(containerHeight*0.7*1.5);
        $(".postcardWallList").width(numOfCards*containerHeight*0.7*1.5+100);
      }else{
        childlist.height((containerHeight*0.7)/2);
        childlist.width((containerHeight*0.7)/2*1.5);
        $(".postcardWallList").width(((numOfCards+1)/2)*(containerHeight*0.7/2)*1.5+100);
      }
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
      var current = this;
      $(window).resize(function(){
        current.resizePostcard();
      })
      if(app.router.scroller){
        app.router.scroller.refresh();
      }
    }
});


Postcard.Views.SentList = Postcard.Views.List.extend({

    className: "postcardWallList",

    beforeRender: function(){
      this.$el.children().remove();
      this.collection.each(function(postcard){
        this.insertView(new Postcard.Views.SentItem({
          model: postcard
        }));
      }, this);
    },

    afterRender: function(){
      this.resizePostcard();
      var current = this;
      $(window).resize(function(){
        current.resizePostcard();
      })
      if(app.router.scroller){
        app.router.scroller.refresh();
      }
    }
  });


Postcard.Views.PublicList = Postcard.Views.List.extend({
  className: "postcardWallList",

    beforeRender: function(){
      this.$el.children().remove();
      this.collection.each(function(postcard){
        this.insertView(new Postcard.Views.PublicItem({
          model: postcard
        }));
      }, this);
    },

    afterRender: function(){
      this.resizePostcard();
      var current = this;
      $(window).resize(function(){
        current.resizePostcard();
      })
      if(app.router.scroller){
        app.router.scroller.refresh();
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
  className: "postcardArchiveList clearfix",

  beforeRender: function(){
    this.$el.children().remove();
    this.collection.each(function(postcard){
      this.insertView(new Postcard.Views.ArchiveItem({
        model: postcard
      }));
    }, this);
  },

  afterRender : function(){
    var postcardArc = $(".archive.postcard.card");
    postcardArc.height(postcardArc.width()/1.5);
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
  className: "postcardDraftList clearfix",

  beforeRender: function(){
    this.$el.children().remove();
    this.collection.each(function(postcard){
      this.insertView(new Postcard.Views.DraftItem({
        model: postcard
      }));
    }, this);
  },

  afterRender: function(){
    var numOfCards = this.collection.size();
     // console.log("numOfCards: "+ numOfCards);
     var windowHeight = $(window).height();
     var windowWidth = $(window).width();
     var buttonH = windowHeight*0.36;
     var buttonV = windowHeight*0.36*1.5;
     if(buttonV<240){
      buttonV = 240;
      buttonH = buttonV/1.5;
    }

    $("div.compose.new").css("width", buttonV+"");
      $(".compose.face").css("height", buttonH+"");
      $(".compose.face").css("width", buttonV+"");
      $("ul.postcardDraftList li").height(buttonH);
      $("ul.postcardDraftList li").width(buttonV);
      $("#composeContainer>div").width((buttonV+20)*(numOfCards+2)+100);


   if(app.router.scroller){
        app.router.scroller.refresh();
    }
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
      var windowHeight = $(window).height();
      var windowWidth = $(window).width();
      $("#displaypostcard>div").width(windowHeight*0.7*1.5+100);
      $(".display.postcard.container").height(windowHeight*0.7).width(windowHeight*0.7*1.5);
      var current = this;
      $(current.el).bind("tapone", function(e){
        $(current.el).find('.card').toggleClass('flip');
      });

      // select delete button
      $('a[title="archive"]').bind("click", function(e){
        $.ajax({
          type: "PUT",
          url: "http://54.251.37.19/api.php/postcard/" + $(".display.postcard.container").attr("data-pid") + "/archive/",
          data: {token: $.cookie("token")},
          success: function(ev){
            app.router.go("wall");
          }
        });
      });

      // mark as read if the postcard used to be unread
      if(this.model.get("status") == 1){
        $.ajax({
          type: "PUT",
          url: "http://54.251.37.19/api.php/postcard/" + this.model.get("pid") + "/read/",
          data: {token: $.cookie("token")},
          success: function(ev){
          }
        });
      }
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
      "click .send" : "uploadNew",
      "click .discard" : "goBack",
      "click .save" : "saveNew",
      "click .textstyle" : "changeStyle"
    },

    changeStyle: function(ev){
      var currentbutton = ev.target;
      var currentStyle = $(currentbutton).attr("id");
      console.log(currentStyle);
      $("p.create, label.postcard, input").removeClass("style style1 style2 style3 style4");
      $("p.create, label.postcard, input").addClass(currentStyle);
      $(".create.postcard.backwrap").removeClass("style style1 style2 style3 style4")
      $(".create.postcard.backwrap").addClass(currentStyle);
      $(".stamp").removeClass("style style1 style2 style3 style4");
      $(".stamp").addClass(currentStyle);
      $(".chop").removeClass("style style1 style2 style3 style4");
      $(".chop").addClass(currentStyle);
      $(".postcard.content").removeClass("style style1 style2 style3 style4");
      $(".postcard.content").addClass(currentStyle);
    },

    saveNew: function(ev){
      var photo = $("#imageCanvas").get(0);

      // check if any photos are attached
      if(photo != undefined && photo.title != undefined){
        var photo_data_url = photo.toDataURL(); // store data url for the image
        var photo_height = photo.height;
        var photo_width = photo.width;
      }
      else{
        var photo_data_url = "";
        var photo_height = 0;
        var photo_width = 0;
      }

      // check for the style being used
      var text_style;
      if($(".front.face").hasClass("style1")){
        text_style = 1;
      }
      else{
        if($(".front.face").hasClass("style2")){
          text_style = 2;
        }
        else{
          if($(".front.face").hasClass("style3")){
            text_style = 3;
          }
          else{
            text_style = 4;
          }
        }
      }

      // if the user is currently logged in online
      if($.cookie("token") != null && $.cookie("uid") != null){

        if($("#createPostcardWrap").attr("data-pid") == -1){
          // save the postcard as a draft version
          // top, left, width, height, photo_effect should be recorded
          $.ajax({
            type: "POST",
            url: "http://54.251.37.19/api.php/postcard/",
            data: {
              token: $.cookie("token"), 
              body: $("textarea.content").val(), 
              body_effect: text_style, 
              uid_from: $.cookie("uid"), 
              top: 0, 
              left: 0, 
              width: photo_width, 
              height: photo_height, 
              data_url: photo_data_url, 
              photo_effect: 0, 
              postcard_effect: 0, 
              status: 0, // indicating this postcard is sent and unread 
              mail: $("input[name=email]").val(),
              public_card: 0},


            success: function(response){
              
              // add postcard into draft collection
              var new_postcard = new Postcard.Model({
                token: $.cookie("token"), 
                body: $("textarea.content").val(), 
                body_effect: text_style, 
                uid_from: $.cookie("uid"), 
                top: 0, 
                left: 0, 
                width: photo_width, 
                height: photo_height, 
                data_url: photo_data_url, 
                photo_effect: 0, 
                postcard_effect: 0, 
                status: 0, // indicating this postcard is draft only 
                mail: $("input[name=email]").val(),
                pid: response,
                public_card: 0
              });


              // adding the new draft into collections
              app.router.allPos.add(new_postcard);
              app.router.draPos.add(new_postcard);

              // renew the locally stored data
              localStorage.setItem('all_postcard', app.router.allPos.toJSON());


              // going back to draft list
              app.router.go("wall");
            },
            error: function(error){
              alert("Oops! An error occured! :(");
            }
          });
        }
        else{
          // save the postcard as a draft version
          // top, left, width, height, photo_effect should be recorded
          $.ajax({
            type: "PUT",
            url: "http://54.251.37.19/api.php/postcard/" + $("#createPostcardWrap").attr("data-pid"),
            data: {
              token: $.cookie("token"), 
              body: $("textarea.content").val(), 
              body_effect: text_style, 
              uid_from: $.cookie("uid"), 
              top: 0, 
              left: 0, 
              width: photo_width, 
              height: photo_height, 
              data_url: photo_data_url, 
              photo_effect: 0, 
              postcard_effect: 0, 
              status: 0, // indicating this postcard is sent and unread 
              mail: $("input[name=email]").val(),
              public_card: 0},


            success: function(response){              
              // add postcard into draft collection
              var new_postcard = new Postcard.Model({
                token: $.cookie("token"), 
                body: $("textarea.content").val(), 
                body_effect: text_style, 
                uid_from: $.cookie("uid"), 
                top: 0, 
                left: 0, 
                width: photo_width, 
                height: photo_height, 
                data_url: photo_data_url, 
                photo_effect: 0, 
                postcard_effect: 0, 
                status: 0, // indicating this postcard is draft only 
                mail: $("input[name=email]").val(),
                pid: response,
                public_card: 0
              });

              // adding the new draft into collections
              app.router.allPos.add(new_postcard);
              app.router.draPos.add(new_postcard);

              // renew the locally stored data
              localStorage.setItem('all_postcard', app.router.allPos.toJSON());

              // going back to draft list
              app.router.go("wall");
            },
            error: function(error){
              alert("Oops! An error occured! :(");
            }
          });
        }
        
      }
      else{
        // add postcard into draft collection with a dummy pid
        var new_postcard = new Postcard.Model({
          token: $.cookie("token"), 
          body: $("textarea.content").val(), 
          body_effect: text_style, 
          uid_from: $.cookie("uid"), 
          top: 0, 
          left: 0, 
          width: photo_width, 
          height: photo_height, 
          data_url: photo_data_url, 
          photo_effect: 0, 
          postcard_effect: 0, 
          status: 0, // indicating this postcard is draft only 
          mail: $("input[name=email]").val(),
          public_card: 0,
          pid: -1
        });

        // adding the new draft into collections
        app.router.allPos.add(new_postcard);
        app.router.draPos.add(new_postcard);

        // renew the locally stored data
        localStorage.setItem('all_postcard', app.router.allPos.toJSON());

        // going back to draft list
        app.router.go("wall");
      }

    },

    uploadNew: function(ev){

      if($("input[name=email]").val() == null || $("input[name=email]").val() == ""){
        alert("Please specify the receiver's email!");
      }
      else{
        var photo = $("#imageCanvas").get(0);
      
        if(photo != undefined && photo.title != undefined){
          var photo_data_url = photo.toDataURL(); // store data url for the image
        }
        else{
          var photo_data_url = "";
        }

        // check for the style being used
        var text_style;
        if($(".front.face").hasClass("style1")){
          text_style = 1;
        }
        else{
          if($(".front.face").hasClass("style2")){
            text_style = 2;
          }
          else{
            if($(".front.face").hasClass("style13")){
              text_style = 3;
            }
            else{
              text_style = 4;
            }
          }
        }
        
        // sending the postcard as the completed version
        // top, left, width, height, photo_effect would all
        // be applied already. no need to specify
        $.ajax({
          type: "POST",
          url: "http://54.251.37.19/api.php/postcard/",
          data: {
            token: $.cookie("token"), 
            body: $("textarea.content").val(), 
            body_effect: text_style, 
            uid_from: $.cookie("uid"), 
            top: 0, 
            left: 0, 
            width: 300, 
            height: 200, 
            data_url: photo_data_url, 
            photo_effect: 0, 
            postcard_effect: 0, 
            status: 1, // indicating this postcard is sent and unread 
            mail: $("input[name=email]").val(),
            public_card: 0},

          success: function(response){
            
            // add postcard into sent collection
            var new_postcard = new Postcard.Model({
              token: $.cookie("token"), 
              body: $("textarea.content").val(), 
              body_effect: text_style, 
              uid_from: $.cookie("uid"), 
              top: 0, 
              left: 0, 
              width: 300, 
              height: 200, 
              data_url: photo_data_url, 
              photo_effect: 0, 
              postcard_effect: 0, 
              status: 1, // indicating this postcard is sent and unread 
              mail: $("input[name=email]").val(),
              pid: response,
              public_card: 0
            });

            // adding the new postcard into collections
            app.router.allPos.add(new_postcard);
            app.router.draPos.add(new_postcard);

            // renew the locally stored data
            localStorage.setItem('all_postcard', app.router.allPos.toJSON());

            // going back to draft list
            app.router.go("wall");
          },
          error: function(error){
            alert("Oops! An error occured! :(");
          }
        });
      }
    },

    goBack: function(ev){
      app.router.go("compose");
    },

    afterRender: function(){

      // detecting geo-location

      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
        }, function(){
          alert("Sorry we cannot find your location right now :(");
        });
      }

// the following is with google map 
// but it hardly works      
/*      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          var geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(lat, lng);
          geocoder.geocode({'latLng': latlng}, function(results, status){
            if (status == window.google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                alert(results[0].formatted_address);
              }
            } 
          });
        }, function(){
          alert("Sorry we cannot find your location right now :(");
        });
      }
*/
      var postcard = $(this.el).find('.create.postcard.container');
      var postcardH = postcard.height();
      var postcardW = postcardH*1.5;
      postcard.width(postcardW);
      var current = this;
      $(".flipback").click(function(e){
        $("form textarea button").hide();
        $(current.el).find(".postcard.card").toggleClass("flip");
        $(e.target).fadeOut(200).delay(800).fadeIn(200,function(){
          $("form textarea button").fadeIn(200);
        });
      });

      $("#uploadimage").click(function(){
        $("#imageinput").click();
      });

      if(this.scroller){
        this.scroller.destroy();
        this.scroller=false;
      }

      this.scroller = new iScroll('createPostcardWrap', {
        vScroll: false,
        vScrollbar: false,
        hScrollbar: false,
        useTransform: false,
        onBeforeScrollStart: function (e) {
          var target = e.target;
          while (target.nodeType != 1) target = target.parentNode;

          if (target.tagName!='BUTTON' && target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
            e.preventDefault();
        }
      });

      $("#imageinput").live('change', function(e){
        console.log("inside change");
        $("#canvasWrapper").children().remove();
        uploadPhoto(e.target.files);
        $("#canvasWrapper").css("z-index", "0")
      });

      console.log(this.model);
      console.log(this.model.get("status"));

      if(this.model.get("status")==0){
        $("#canvasWrapper").children().remove();
        var newimage = new Image();
        newimage.src = "/" + this.model.get("photo").uri;
        console.log(newimage.src);
        var thiscanvas = convertImageToCanvas(newimage);
        $("#uploadimage").addClass("small");
        $("#uploadimage").html("Change");
        $("#canvasWrapper").append(thiscanvas);
        $(".preset-button").removeAttr("disabled");
        $(".preset-button").live("click", function(){
            console.log("clicked button");
        });

        $("#canvasWrapper").css("z-index", "0")

      };

      function uploadPhoto(files){
        console.log("uploadphoto");
        var photo = files[0];
        var reader = new FileReader();
        var newimage = new Image();
        reader.onload = function(e){
          //console.log(e.target.result);
          newimage.src = e.target.result;
          $("#uploadimage").addClass("small");
          $("#uploadimage").html("Change");

          var thiscanvas = convertImageToCanvas(newimage);
          $("#canvasWrapper").append(thiscanvas);
          $(".preset-button").removeAttr("disabled");

          $(".preset-button").live("click", function(){
            console.log("clicked button");
        });
      };
      reader.readAsDataURL(photo);
    };

    function convertImageToCanvas(image){
      console.log("convert to image");
      var canvas = document.createElement("canvas");
      canvas.className = "imageCanvas";
      canvas.setAttribute("id","imageCanvas");
      image.onload = function(){
        console.log("width: "+ image.width + " ,height: "+ image.height);
        var wwidth = $("#canvasWrapper").width();
        var wheight= $("#canvasWrapper").height();
        canvas.width = wwidth;
        canvas.height = wheight;
        if((wwidth/wheight)>(image.width/image.height)){
          canvas.getContext("2d").drawImage(image, 0, 0, wwidth, (wwidth/image.width)*image.height);
        }else{
          canvas.getContext("2d").drawImage(image, 0, 0, (wheight/image.height)*image.width, wheight);
        }
        console.log(canvas.getContext("2d").getImageData(0,0, 20, 20));
      };
      return canvas;
    }
  }
});

  // Required, return the module for AMD compliance
  return Postcard;
});