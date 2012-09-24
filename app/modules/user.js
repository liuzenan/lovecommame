define([
	//main app
	"app",

	//libs
	"backbone"
], 

function(app, Backbone){
	
	var User = app.module();

	// user model contains username, email address and uid
	User.Model = Backbone.Model.extend();

	//User login view
	User.Views.Login = Backbone.View.extend({
		template : "tpl_login",

		events: {
			"submit form" : "login"
		},

		login: function(ev){
			alert("inside login");

			$.ajax({
			  type: "POST",
			  url: "../api.php/user/login",
			  data: { uname: "inian", pass: window.btoa("pass")}
			}).done(function( msg ) {
			  alert( "Data Saved: " + msg );
			});

			app.router.go("wall");
			return false; 
		}
	});

	//User Sign up view
	User.Views.Signup = Backbone.View.extend({
		template : "tpl_signup",

		events: {
			"submit form" : "signup"
		},

		signup: function(ev){
			register();
			app.router.go("wall"); // or should it go to a re-direct page?
			return false;
		},

		validate: function(){
			// check if all fields are filled up

			// check if two passwords are the same
		},

		register: function(){
			// serialize user credential data
			var serializedData = $("form").serialize();
			var $inputs = $("form").find("input, select, button, textarea");

			// temperarily disable all inputs during the ajex request
			$inputs.attr("disabled", "disabled");

			// uploading user credential form to the server
			$.ajex({
				url: 'ec2-54-251-19-5.ap-southeast-1.compute.amazonaws.com/api.php/user',
				type: 'post',
				dataType: 'json',
				data: serializedData,
				success: function(data){
					alert("successful");
					// check whether the email already exists in DB
				},
				error: function(){
					alert("error!");
					// for debugging purposes
				}
			});
		}
	});

	return User;

});