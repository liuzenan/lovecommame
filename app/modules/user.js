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
				    	$.cookie("username", $("input[name=username]").val(), {expires: 99});
				    	$.cookie("password", $("input[name=password]").val(), {expires: 99});
				    }
				    else{
				    	$.cookie("username", null);
				    	$.cookie("password", null);
				    }
				    // store token in cookie for future usage
				    $.cookie("token", response);

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
			// disable inputs when 
			$inputs = $(this).find("input, select, button, textarea");
			$inputs.prop("disabled", true);

			if($("input[name=password]").val() != $("input[name=re-password]").val()){
				alert("your passwords are not consistent");
			}
			else{
				app.router.go("wall");
			}
/*
			$.ajax({
			  	type: "POST",
			  	url: "../api.php/user/",
			  	data: {uname: $("input[name=username]").val(), email: $("input[name=email]").val(), pass: window.btoa($("input[name=password]").val())},
			  	
			  	// if successful
			  	success: function(response, textStatus, jqXHR){
				    $.cookie("token", response);

				    // navigate to the wall page
				    app.router.go("wall");
				},
				// callback handler that will be called on error
				error: function(jqXHR, textStatus, errorThrown){

				    alert("Sorry we cannot sign you up right now!")
				},
				// callback handler that will be called on completion
				// which means, either on success or error
				complete: function(textStatus){
				    // enable the inputs
				    $inputs.prop("disabled", false);
				}
			});
*/
			return false;
		}
	});

	return User;

});