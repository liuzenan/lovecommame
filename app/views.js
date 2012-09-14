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
			"click" : "update"
		},

		update: function(e){
			alert('updated');
		},

		render: function(layout){
			return layout(this).render({user: this.model.toJSON()});
		}
			
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