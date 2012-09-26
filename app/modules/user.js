define([
	//main app
	"app",

	//libs
	"backbone"
], 

function(app, Backbone){
	
	var User = app.module();

	// user model contains username, email address and uid
	User.Model = Backbone.Model.extend({
		// migrate functions from view to model 

	});

	//User login view
	User.Views.Login = Backbone.View.extend({
		template : "tpl_login",

		events: {
			"submit form" : "login"
		},

		login: function(ev){
			// disable inputs when 
			$inputs = $(this).find("input, select, button, textarea");
			$inputs.prop("disabled", true);

			$.ajax({
			  	type: "POST",
			  	url: "../api.php/user/login",
			  	data: {uname: $("input[name=username]").val(), pass: window.btoa($("input[name=password]").val())},
			  	
			  	// if successful
			  	success: function(response, textStatus, jqXHR){
			  		// remember username and password if checkbox is checked
				    if($("input[name=rmbme]").is(':checked')){
				    	$.cookie("username", $("input[name=username]").val());
				    	$.cookie("password", $("input[name=password]").val());
				    }
				    else{
				    	$.cookie("username", null);
				    	$.cookie("password", null);
				    }

				    // navigate to the wall page
				    app.router.go("wall");
				},
				// callback handler that will be called on error
				error: function(jqXHR, textStatus, errorThrown){

				    alert("Sorry we cannot log you in. Please check your email address or password!")
				},
				// callback handler that will be called on completion
				// which means, either on success or error
				complete: function(textStatus){
				    // enable the inputs
				    $inputs.prop("disabled", false);
				}
			});

			return false; 
		},

		// load stored username and password once rendered
		afterRender: function(){
			if($.cookie("username") != null){
				$("input[name=username]").val($.cookie("username"));
				$("input[name=password]").val($.cookie("password"));
				$("input[name=rmbme]").prop("checked", true);
			}
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