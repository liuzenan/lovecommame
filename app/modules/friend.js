define([
	//main application
	"app",

	//libs
	"backbone",

	//modules
	"modules/user"
],

function(app, Backbone){

	var Friend = app.module();

	Friend.Collection = Backbone.Collection.extend({
		url: function(){
			return;
		},

		cache: true,

		parse: function(obj){
			//safty check to ensure only valid data is used
			if(obj.data.message !== "Not Found"){
				this.status = "valid";
				return obj.data;
			}

			this.status = "invalid";
			return this.models;
		},

		initialize: function(models,options){
			if(options){
				this.user = options.user;
			}
		}
	});


});