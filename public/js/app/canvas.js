$(function(){
  var context = $('#canvas')[0].getContext("2d");

  var colors = {purple: "palevioletred", green: "olivedrab", brown: "sienna", yellow: "gold", black: "black", blue: "deepskyblue", orange: "darkorange", gray: "gray"};
  var curColor = colors.purple;
  var curTool = "marker";
  var curSize = 5;

  var next = 0, paint = false;

  var interactiveKey = null;

  var lineManager = new LineManager();

  function addClick(x, y, dragging){
    if(dragging === "0"){
      lineManager.startLine(x, y, curColor, curSize, curTool, dragging);
    } else {
      lineManager.continueLine(x, y, curColor, curSize, curTool, dragging);
    }
  }

  $('.tool').on('click', function(){
    curTool = $(this).val();
    $(".tool").removeClass("press");
    $(this).addClass("press");
  });

  $('.color').on('click', function(){
    curColor = colors[ $(this).val() ];
    $(".color").removeClass("press");
    $(this).addClass("press");
    curTool = "marker";
    $(".tool").removeClass("press");
    $("button[value=marker]").addClass("press");
  });

  $('.size').on('click', function(){
    curSize = $(this).val();
    $(".size").removeClass("press");
    $(this).addClass("press");
  });

  $('#undo').on('click', function(){
    lineManager.undoLine();
    redraw();
  });

  $('#clear_canvas').on('click', function(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    lineManager.clearAll();
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
    lineManager.endLine();
  });

  $('#canvas').mouseleave(function(e){
    paint = false;
  });

  if ( location.pathname.search(/^\/interactive\/.{10}$/) !== -1 ){
    interactiveKey = location.pathname.split('/')[2];
    lineManager.interactiveKey = interactiveKey;
    var es = new EventSource('/connect/' + interactiveKey );
    es.onmessage = function(e) {
      lineManager.mergeLines($.parseJSON(e.data));
      redraw();
    };
  }

  function redraw(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#ffffff";
    context.fill();
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.lineJoin = "round";

    line_data = lineManager.getLines();
    var clickX = line_data["x"];
    var clickY = line_data["y"];
    var clickColor = line_data["color"];
    var clickSize = line_data["size"];
    var clickTool = line_data["tool"];
    var clickDrag = line_data["drag"];

    for(var i=0; i < clickX.length; i++) {
      context.beginPath();
      if( ( clickDrag[i] == '1' ) && i){
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
});

