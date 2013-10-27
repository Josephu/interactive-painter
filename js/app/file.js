$(function(){
  $('#load').on('click', function() {
    var f = document.getElementById("image-to-upload").files[0];
    if(typeof f != "undefined"){
      var ctx = document.getElementById('canvas').getContext('2d');
      var img = new Image();
      var url = window.URL || window.webkitURL;
      var src = url.createObjectURL(f);
      img.src = src;
      img.onload = function(){
        dimension = resizeImage(img);
        $('#canvas').attr({width: dimension.width, height: dimension.height});
        ctx.drawImage(img,0,0, dimension.width, dimension.height);
        url.revokeObjectURL(src);
      };
    }
  });
  function resizeImage(img){
    var MAX_WIDTH = 640;
    var MAX_HEIGHT = 480;
    var width = img.width;
    var height = img.height;
     
    if (width > height) {
      if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
    } else {
      if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
    }
    return {width: width, height: height};
  }
});
