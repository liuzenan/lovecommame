define([
  "app",

  // Libs
  "backbone"

  // Modules

  // Plugins
],

function(app, Backbone) {

  // Create a new module
  var Example = app.module();
  
  // This will fetch the tutorial template and render it.
  Example.Views.Index = Backbone.View.extend({
    template: "tpl_login",

    serialize: function() {
      return { object : "World" };
    }
  });

  // Required, return the module for AMD compliance
  return Example;

});
