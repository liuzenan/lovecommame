define([
	//main app
	"app",

	//libs
	"backbone"
], 

function(app, Backbone){
	
	var User = app.module();

	User.Model = Backbone.Model.extend({
			//to be implemented
	});

	//User login view
	User.View.Login = Backbone.View.extend({

	});

	//User Sign up view
	User.View.Signup = Backbone.View.extend({

	});

});