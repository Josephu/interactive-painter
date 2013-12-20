$(function(){
  var context = $('#canvas')[0].getContext("2d");

  var colors = {purple: "palevioletred", green: "olivedrab", brown: "sienna", yellow: "gold", black: "black", blue: "deepskyblue", orange: "darkorange", gray: "gray"};
  var curColor = colors.purple;
  var curTool = "marker";
  var curSize = 5;

  var next = 0, paint = false;

  var interactiveKey = null;

  var dataStack = new DataStack();

  function addClick(x, y, dragging){
    dataStack.push(x, y, curColor, curSize, curTool, dragging);
  }

  $('.tool').on('click', function(){
    curTool = $(this).val();
  });

  $('.color').on('click', function(){
    curColor = colors[ $(this).val() ];
  });

  $('.size').on('click', function(){
    curSize = $(this).val();
  });

  $('#undo').on('click', function(){
    dataStack.pop();
    redraw();
  });

  $('#clear_canvas').on('click', function(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    dataStack.clear();
    dataStack.sync();
  });

  $('#canvas').on( "touchstart mousedown", function(e){
    if(e.type == "mousedown" || (e.type == "touchstart" && e.originalEvent.touches.length == 1) ){
      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, "0");
      redraw();
    }
    else{
      paint = false;
    }
  });

  $('#canvas').on( "touchmove mousemove", function(e){
    if(paint){
      var pageX = isMobile.any() ? e.originalEvent.touches[0].pageX : e.pageX;
      var pageY = isMobile.any() ? e.originalEvent.touches[0].pageY : e.pageY;
      addClick(pageX - this.offsetLeft, pageY - this.offsetTop, "1");
      redraw();
      e.preventDefault();
    }
  });

  $('#canvas').on( "touchend mouseup", function(e){
    paint = false;
    dataStack.sync();
  });

  $('#canvas').mouseleave(function(e){
    paint = false;
  });

  if ( location.pathname.search(/^\/interactive\/.{10}$/) !== -1 ){
    interactiveKey = location.pathname.split('/')[2];
    dataStack.interactiveKey = interactiveKey;
    var es = new EventSource('/connect/' + interactiveKey );
    es.onmessage = function(e) {
      dataStack.replace($.parseJSON(e.data));
      redraw();
    };
  }

  function redraw(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.lineJoin = "round";

    for(var i=0; i < dataStack.clickX.length; i++) {
      context.beginPath();
      if( ( dataStack.clickDrag[i] == '1' ) && i){
        context.moveTo(dataStack.clickX[i-1], dataStack.clickY[i-1]);
      }else{
        context.moveTo(dataStack.clickX[i]-1, dataStack.clickY[i]-1);
      }
      context.lineTo(dataStack.clickX[i], dataStack.clickY[i]);
      context.closePath();
      if(dataStack.clickTool[i] == 'eraser'){
        context.strokeStyle = "white";
        context.lineWidth = dataStack.clickSize[i]+1;
      }
      else{
        context.strokeStyle = dataStack.clickColor[i];
        context.lineWidth = dataStack.clickSize[i];
      }
      context.stroke();
      next = i+1;
    }
  }
});

