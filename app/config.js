// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["main"],

  paths: {
    // JavaScript folders.
    libs: "../assets/js/libs",
    plugins: "../assets/js/plugins",
    vendor: "../assets/vendor",

    // Libraries.
    jquery: "../assets/js/libs/jquery",
    lodash: "../assets/js/libs/lodash",
    backbone: "../assets/js/libs/backbone",
    json2: "../assets/js/libs/json2"
  },

  shim: {
    // Backbone library depends on underscore and jQuery.
    backbone: {
      deps: ["lodash", "jquery", "json2"],
      exports: "Backbone"
    },

    "plugins/jgestures" : ["jquery"],
    "plugins/jsmanipulate" : ["jquery"],
    // Backbone.LayoutManager depends on Backbone.
    "plugins/backbone.layoutmanager": ["backbone"],
    // Backbone.CollectionCache depends on Backbone.
    "plugins/backbone.collectioncache": ["backbone"],
    "plugins/jquery.cookie" : ["jquery"],
    "plugins/jquery.ocupload" : ["jquery"]
  }

});
