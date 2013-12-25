require.config({
  paths: {
      modernizr: 'lib/modernizr-2.6.2.min',
      jquery: 'lib/jquery-1.10.1.min',
      underscore: 'lib/underscore-min',
      mobile: 'app/mobile'
    },
  waitSeconds: 200
});

require(['modernizr', 'jquery', 'underscore', 'mobile'], function(){
  require(['app/line_manager'], function(){
    require(['app/canvas', 'app/file']);
  });
});
