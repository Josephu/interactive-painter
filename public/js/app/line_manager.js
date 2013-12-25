function LineManager() {
  var click = {};

  var resetClick = function() {
    _.each(["x", "y", "color", "size", "tool", "drag"], function (attr) {
      click[attr] = [];
    });
  }

  resetClick();

  this.interactiveKey = null;

  this.startLine = function (x, y, color, size, tool, drag) {
    click.x.push([x.toString()]);
    click.y.push([y.toString()]);
    click.color.push([color]);
    click.size.push([size.toString()]);
    click.tool.push([tool]);
    click.drag.push([drag]);
  };
  this.continueLine = function (x, y, color, size, tool, drag) {
    _.last(click.x).push(x.toString());
    _.last(click.y).push(y.toString());
    _.last(click.color).push(color);
    _.last(click.size).push(size.toString());
    _.last(click.tool).push(tool);
    _.last(click.drag).push(drag);
  };
  this.endLine = function () {
    if (this.interactiveKey !== null) {
      $.post('/push/' + this.interactiveKey, {
        data: {
          x: _.last(click.x),
          y: _.last(click.y),
          color: _.last(click.color),
          size: _.last(click.size),
          tool: _.last(click.tool),
          drag: _.last(click.drag)
        }
      }, 'json');
    }
  };
  this.clearAll = function () {
    resetClick();

    if (this.interactiveKey !== null) {
      $.post('/clear/' + this.interactiveKey, 'json');
    }
  };
  this.mergeLines = function (data) {
    _.each(["x", "y", "color", "size", "tool", "drag"], function (attr) {
      data[attr].push(_.last(click[attr]));
      click[attr] = data[attr];
    });
  };
  this.undoLine = function () {
    _.each(["x", "y", "color", "size", "tool", "drag"], function (attr) {
      click[attr].pop();
    });
  };
  this.getLines = function () {
    var data = {};
    _.each(["x", "y", "color", "size", "tool", "drag"], function (attr) {
      data[attr] = _.flatten(click[attr]);
    });
    return data;
  };
  this.getRawData = function () {
    var data = {};
    _.each(["x", "y", "color", "size", "tool", "drag"], function (attr) {
      data[attr] = click[attr];
    });
    return data;
  };
}