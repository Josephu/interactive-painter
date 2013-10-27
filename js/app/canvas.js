$(function(){
  context = $('#canvas')[0].getContext("2d");

  var colors = {purple: "palevioletred", green: "olivedrab", brown: "sienna", yellow: "gold"};
  var curColor = colors.purple;
  var curTool = "marker";
  var curSize = 5;

  var clickX = [], clickY = [],  clickDrag = [];
  var next = 0, paint = false;

  function addClick(x, y, dragging){
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
  }

  $('.tool').on('click', function(){
    curTool = $(this).val();
  });

  $('.color').on('click', function(){
    curColor = colors[ $(this).val() ];
  });

  $('.size').on('click', function(){
    curSize = $(this).val();
  })

  $('#download_image').on('click', function(){
    var data = canvas.toDataURL().replace("image/png", "image/octet-stream");
    this.href = data;
    this.download = "image.png";
  });

  $('#clear_canvas').on('click', function(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  });

  $('#canvas').mousedown(function(e){
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
  });
  
  $('#canvas').mousemove(function(e){
    if(paint){
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
  });

  $('#canvas').mouseup(function(e){
    paint = false;
  });

  $('#canvas').mouseleave(function(e){
    paint = false;
  });

  function redraw(){
    context.lineJoin = "round";

    for(var i=next; i < clickX.length; i++) {
      context.beginPath();
      if(clickDrag[i] && i){
        context.moveTo(clickX[i-1], clickY[i-1]);
      }else{
        context.moveTo(clickX[i]-1, clickY[i]-1);
      }
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      if(curTool == 'eraser')
        context.strokeStyle = "white";
      else
        context.strokeStyle = curColor;
      context.lineWidth = curSize;
      context.stroke();
      next = i+1;
    }
  }
});

