require.config({
  paths: {
    modernizr: 'lib/modernizr-2.6.2.min',
    jquery: 'lib/jquery-1.10.1.min',
    underscore: 'lib/underscore-min',
    mobile: 'app/mobile',
    line_manager: 'app/line_manager',
    canvas: 'app/canvas',
    file: 'app/file'
  },
  shim: {
      'canvas': ['line_manager'],
      'file': ['jquery', 'underscore'],
      'jquery': ['modernizr'],
      'line_manager': ['jquery', 'underscore']
  },
  waitSeconds: 200
});

require(['modernizr', 'jquery', 'underscore', 'mobile', 'line_manager', 'canvas', 'file'], function() {});
