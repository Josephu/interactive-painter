require.config({
  paths: {
      modernizr: 'lib/modernizr-2.6.2.min',
      jquery: 'lib/jquery-1.10.1.min',
      underscore: 'lib/underscore-min'
    }
});

require(['modernizr', 'jquery', 'underscore'], function(){ 
  require(['app/canvas', 'app/file']);
});
