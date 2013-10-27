$(function(){
  $('#canvas')[0].ondragover = function() { return false; };
  $('#canvas')[0].ondrop = function(e){
    uploadImage( e.dataTransfer.files[0] );
    return false;
  };
  $('#load').on('click', function() {
    uploadImage( document.getElementById("image-to-upload").files[0] );
  });

  function uploadImage(file){
    if(typeof file != "undefined"){
      var ctx = document.getElementById('canvas').getContext('2d');
      var img = new Image();
      var url = window.URL || window.webkitURL;
      var src = url.createObjectURL(file);
      img.src = src;
      img.onload = function(){
        dimension = resizeImage(img);
        $('#canvas').attr({width: dimension.width, height: dimension.height});
        ctx.drawImage(img,0,0, dimension.width, dimension.height);
        url.revokeObjectURL(src);
      };
    }
  }

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
