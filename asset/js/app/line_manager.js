function LineManager(interactiveKey) {
  var click = {};

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
    } else {
      _.each(["x", "y", "color", "size", "tool", "drag"], function (attr) {
        localStorage.setItem(attr, JSON.stringify(click[attr]));
      });
    }
  };
  this.clearAll = function () {
    resetClick();
    resetLocalStorage();

    if (this.interactiveKey !== null) {
      $.post('/clear/' + this.interactiveKey, 'json');
    }
  };
  this.mergeLines = function (data) {
    if(data.x.length !== 0){
      _.each(["x", "y", "color", "size", "tool", "drag"], function (attr) {
        data[attr].push(_.last(click[attr]));
        click[attr] = data[attr];
      });
    } else {
      resetClick();
    }
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

  function resetClick() {
    _.each(["x", "y", "color", "size", "tool", "drag"], function (attr) {
      click[attr] = [];
    });
  }

  function resetLocalStorage() {
    _.each(["x", "y", "color", "size", "tool", "drag"], function (attr) {
      localStorage.setItem(attr, JSON.stringify([]));
    });
  }

  function initialize (self) {
    if(interactiveKey === undefined){
      if(localStorage.getItem("x") !== null){
        _.each(["x", "y", "color", "size", "tool", "drag"], function (attr) {
          click[attr] = JSON.parse(localStorage.getItem(attr)); // Access local storage for single user mode
        });
      } else {
        resetClick();
      }
    } else {
      self.interactiveKey = interactiveKey;
    }
  }

  initialize(this);
}