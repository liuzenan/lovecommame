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
				    var temp = $.parseJSON(response);

				    $.cookie("uid", temp.uid);
				    $.cookie("token", temp.token);

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
			// check internect connection
			if(navigator.onLine){
				// check if username and password exist in cookie
				if($.cookie("username") != null){
					$("input[name=username]").val($.cookie("username"));
					$("input[name=password]").val($.cookie("password"));
					$("input[name=rmbme]").prop("checked", true);
				}
			}
			else{
				// check if username and password exist in cookie
				if($.cookie("username") != null){
					$("input[name=username]").val($.cookie("username"));
					$("input[name=password]").val($.cookie("password"));
					$("input[name=rmbme]").prop("checked", true);
					// disable inputs so that no user switch is allowed
					$("input").prop('disabled', true);
				}
				else{
					$("h2").text("Please get internet connection");
					$("button").prop("disabled", true);
				}
			}
		},

		initialize: function(){
			// clear token first
			$.cookie("token", null);
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

			// make sure all fields are filled up
			if($("input[name=usename]").val() == null || $("input[name=usename]").val() == "" || $("input[name=email]").val() == null || $("input[name=email]").val() == "" || $("input[name=password]").val() == null || $("input[name=password]").val() == "" || $("input[name=re-password]").val() == null || $("input[name=re-password]").val() == ""){
				alert("Please fill in all fields!");
			}
			else{
				// make sure the passwords are the same
				if($("input[name=password]").val() != $("input[name=re-password]").val()){
					alert("Please type the same password!");
				}
				else{
					$.ajax({
					  	type: "POST",
					  	url: "../api.php/user/",
					  	data: {uname: $("input[name=username]").val(), email: $("input[name=email]").val(), pass: window.btoa($("input[name=password]").val())},
					  	
					  	// if successful
					  	success: function(response, textStatus, jqXHR){
						    // store token in cookie for future usage
						    var temp = $.parseJSON(response);

						    $.cookie("uid", temp.uid);
						    $.cookie("token", temp.token);

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
				}
			}
			return false;
		}
	});

	return User;

});