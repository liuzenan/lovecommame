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
		
	});

	//wall view
	V.Wall = Backbone.View.extend({

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