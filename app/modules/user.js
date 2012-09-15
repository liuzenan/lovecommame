define([
	//main app
	"app",

	//libs
	"backbone"
], 

function(app, Backbone){
	
	var User = app.module();

	User.Model = Backbone.Model.extend();

	//User login view
	User.Views.Login = Backbone.View.extend({
		template : "tpl_login",

		events: {
			"submit form" : "login"
		},

		login: function(ev){
			app.router.go("wall");
			return false;
		}
	});

	//User Sign up view
	User.Views.Signup = Backbone.View.extend({

	});

	return User;

});