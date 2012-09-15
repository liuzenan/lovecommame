define([
  // Libraries.
  "zepto",
  "lodash",
  "backbone",
  "text!templates/tpl_login.html",
  "text!templates/tpl_postcard_display.html",
  "text!templates/tpl_postcard_edit.html",
  "text!templates/tpl_wall.html"
],

function($, _, Backbone,tpl_login,tpl_postcard_display,tpl_postcard_edit,tpl_wall){

	var V = V || {};

	//login view
	V.Login = Backbone.View.extend({
		el: $("#login"),

		render: function(){},

		events: {
			"submit #loginForm": "authenticate",
			"click #registBtn": "regist",
		},

		authenticate: function(){
			// check if "remember me" is checked
			// if checked, store the username and password in browser cache and start authentication
			// if not checked, directly start authentication
		},

		regist: function(){
			// directly start authentication? or redirect to another registration page?
		}
	});

	//wall view
	V.Wall = Backbone.View.extend({
		el: $("#wall"),

		render: function(){
			// render the wall background?
		},

		events: {
			// associate "swipe_left" and "swipe_right" with event handlers
		}
	});


	//postcard edit mode
	V.PostcardEdit = Backbone.View.extend({

	});


	//edit mode stage 1 -- write message
	V.PostcardEditWrite = Backbone.View.extend({

	});

	//edit mode stage 2 -- upload/take photo
	V.PostcardEditPhoto = Backbone.View.extend({

	});

	//edit mode stage 3 -- add photo effect
	V.PostcardEditEffect = Backbone.View.extend({

	});

	//edit mode stage 4 -- send postcard
	V.PostcardEditSend = Backbone.View.extend({

	});

	//postcard display mode
	V.PostcardDisplay = Backbone.View.extend({

	});

	return V;
});