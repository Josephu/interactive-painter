function DataStack() {
  this.clickX = [];
  this.clickY = [];
  this.clickDrag = [];
  this.clickColor = [];
  this.clickSize = [];
  this.clickTool = [];
  this.interactiveKey = null;

  var sync_remote = function (stack, action) {
    $.post('/push/' + stack.interactiveKey, {
      data: {
        x: stack.clickX,
        y: stack.clickY,
        color: stack.clickColor,
        size: stack.clickSize,
        tool: stack.clickTool,
        drag: stack.clickDrag
      },
      action: action
    }, 'json');
  };
  this.push = function (x, y, color, size, tool, dragging) {
    this.clickX.push(x.toString());
    this.clickY.push(y.toString());
    this.clickColor.push(color);
    this.clickSize.push(size.toString());
    this.clickTool.push(tool);
    this.clickDrag.push(dragging);
  };
  this.pop = function () {
    var i;
    for (i = this.clickDrag.length - 1; i >= 0 &&  this.clickDrag[i] !== "0"; i--) {
      this.clickX.pop();
      this.clickY.pop();
      this.clickDrag.pop();
      this.clickColor.pop();
      this.clickSize.pop();
      this.clickTool.pop();
    }
    this.clickX.pop();
    this.clickY.pop();
    this.clickDrag.pop();
    this.clickColor.pop();
    this.clickSize.pop();
    this.clickTool.pop();
  };
  this.clear = function () {
    this.clickX = [];
    this.clickY = [];
    this.clickDrag = [];
    this.clickColor = [];
    this.clickSize = [];
    this.clickTool = [];
  };
  this.replace = function (data) {
    this.clickX = data.x;
    this.clickY = data.y;
    this.clickDrag = data.drag;
    this.clickColor = data.color;
    this.clickSize = data.size;
    this.clickTool = data.tool;
  };
  this.sync = function () {
    if (this.interactiveKey !== null) {
      if (this.clickX.length !== 0) {
        sync_remote(this, "merge");
      } else {
        sync_remote(this, "clear");
      }
    }
  };
}
