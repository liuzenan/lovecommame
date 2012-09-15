define([
  // Libraries.
  "jquery",
  "lodash",
  "backbone"
],

function($, _, Backbone){

	var V = V || {};

	//login view
	V.Login = Backbone.View.extend({

		template:"tpl_login",
		event: {
			"click" : "update", // needs more discussion here
			"submit #loginForm": "authenticate",
			"click #registBtn": "regist"
		},

		update: function(e){
			alert('updated');
		},

		render: function(layout){
			return layout(this).render({user: this.model.toJSON()});
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