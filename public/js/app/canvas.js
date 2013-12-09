$(function(){
  var context = $('#canvas')[0].getContext("2d");

  var colors = {purple: "palevioletred", green: "olivedrab", brown: "sienna", yellow: "gold", black: "black", blue: "deepskyblue", orange: "darkorange", gray: "gray"};
  var curColor = colors.purple;
  var curTool = "marker";
  var curSize = 5;

  var clickX = [], clickY = [], clickDrag = [], clickColor = [], clickSize = [], clickTool = [];
  var next = 0, paint = false;

  var interactiveKey = null;

  function addClick(x, y, dragging){
    clickX.push(x);
    clickY.push(y);
    clickColor.push(curColor);
    clickSize.push(curSize);
    clickTool.push(curTool);
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
  });

  $('#undo').on('click', function(){
    var i;
    for(i = clickDrag.length-1; i >= 0 &&  clickDrag[i] != undefined; i--){
      clickX.pop();
      clickY.pop();
      clickDrag.pop();
      clickColor.pop();
      clickSize.pop();
      clickTool.pop();
    }
    clickX.pop();
    clickY.pop();
    clickDrag.pop();
    clickColor.pop();
    clickSize.pop();
    clickTool.pop();
    redraw();
  });

  $('#clear_canvas').on('click', function(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    clickX = [], clickY = [], clickDrag = [], clickColor = [], clickSize = [], clickTool = [];
    if ( interactiveKey !== null ){
      sync_remote(clickX, clickY, clickColor, clickSize, clickTool, clickDrag, interactiveKey, "clear");
    }
  });

  $('#canvas').on( "touchstart mousedown", function(e){
    if(e.type == "mousedown" || (e.type == "touchstart" && e.originalEvent.touches.length == 1) ){
      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
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
      addClick(pageX - this.offsetLeft, pageY - this.offsetTop, true);
      redraw();
      e.preventDefault();
    }
  });

  $('#canvas').on( "touchend mouseup", function(e){
    paint = false;
    if ( interactiveKey !== null ){
      sync_remote(clickX, clickY, clickColor, clickSize, clickTool, clickDrag, interactiveKey, "merge");
    }
  });

  $('#canvas').mouseleave(function(e){
    paint = false;
  });

  if ( location.pathname.search(/^\/interactive\/.{10}$/) !== -1 ){
    var interactiveKey = location.pathname.split('/')[2]
    var es = new EventSource('/connect/' + interactiveKey );
    es.onmessage = function(e) {
      image_data = $.parseJSON(e.data);
      clickX = image_data["x"];
      clickY = image_data["y"];
      clickDrag = image_data["drag"];
      clickColor = image_data["color"];
      clickSize = image_data["size"];
      clickTool = image_data["tool"];
      redraw();
    };
  }

  function redraw(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.lineJoin = "round";

    for(var i=0; i < clickX.length; i++) {
      context.beginPath();
      if(clickDrag[i] && i){
        context.moveTo(clickX[i-1], clickY[i-1]);
      }else{
        context.moveTo(clickX[i]-1, clickY[i]-1);
      }
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      if(clickTool[i] == 'eraser'){
        context.strokeStyle = "white";
        context.lineWidth = clickSize[i]+1;
      }
      else{
        context.strokeStyle = clickColor[i];
        context.lineWidth = clickSize[i];
      }
      context.stroke();
      next = i+1;
    }
  }

  function sync_remote(clickX, clickY, clickColor, clickSize, clickTool, clickDrag, interactiveKey, action){
    $.post( '/push/'+interactiveKey, {
      data: {
        x:clickX, y:clickY, color: clickColor, size: clickSize, tool: clickTool, drag: clickDrag
      },
      action: action
    }, 'json');
  }
});

