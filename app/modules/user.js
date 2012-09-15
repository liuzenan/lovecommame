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
	User.Views.Login = Backbone.View.extend({

	});

	//User Sign up view
	User.Views.Signup = Backbone.View.extend({

	});

	return User;

});