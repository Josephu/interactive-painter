describe("LineManager:", function () {

  describe("single user mode", function () {
    beforeEach(function () {
      lineManager = new LineManager();
    });

    it("#startLine: expect to create a new line array", function () {
      lineManager.startLine(1, 2, "red", 5, "marker",  "0");

      var data = lineManager.getRawData();
      expect(data.x).toEqual([["1"]]);
      expect(data.y).toEqual([["2"]]);
      expect(data.color).toEqual([["red"]]);
      expect(data.size).toEqual([["5"]]);
      expect(data.tool).toEqual([["marker"]]);
      expect(data.drag).toEqual([["0"]]);
    });

    it("#continueLine: expect to update data arrays", function () {
      lineManager.startLine(1, 2, "red", 5, "marker",  "0");
      lineManager.continueLine(2, 4, "green", 5, "marker", "1");

      var data = lineManager.getRawData();
      expect(data.x).toEqual([["1", "2"]]);
      expect(data.y).toEqual([["2", "4"]]);
      expect(data.color).toEqual([["red", "green"]]);
      expect(data.size).toEqual([["5", "5"]]);
      expect(data.tool).toEqual([["marker", "marker"]]);
      expect(data.drag).toEqual([["0", "1"]]);

      lineManager.startLine(3, 6, "red", 5, "marker", "0");

      data = lineManager.getRawData();
      expect(data.x).toEqual([["1", "2"], ["3"]]);
      expect(data.y).toEqual([["2", "4"], ["6"]]);
      expect(data.color).toEqual([["red", "green"], ["red"]]);
      expect(data.size).toEqual([["5", "5"], ["5"]]);
      expect(data.tool).toEqual([["marker", "marker"], ["marker"]]);
      expect(data.drag).toEqual([["0", "1"], ["0"]]);
    });

    it("#undoLine: expect to remove a line", function () {
      lineManager.startLine(0, 1, "red", 5, "marker", "0");
      lineManager.startLine(1, 2, "red", 5, "marker", "0");
      lineManager.continueLine(2, 4, "red", 5, "marker", "1");
      lineManager.continueLine(3, 6, "red", 5, "marker", "1");

      lineManager.undoLine();

      var data = lineManager.getRawData();
      expect(data.x).toEqual([["0"]]);
      expect(data.y).toEqual([["1"]]);
      expect(data.color).toEqual([["red"]]);
      expect(data.size).toEqual([["5"]]);
      expect(data.tool).toEqual([["marker"]]);
      expect(data.drag).toEqual([["0"]]);
    });

    it("#clearAll: expect to clear all arrays", function () {
      lineManager.startLine(0, 1, "red", 5, "marker",  "0");

      lineManager.clearAll();

      var data = lineManager.getRawData();
      expect(data.x).toEqual([]);
      expect(data.y).toEqual([]);
      expect(data.color).toEqual([]);
      expect(data.size).toEqual([]);
      expect(data.tool).toEqual([]);
      expect(data.drag).toEqual([]);
    });

    it("#mergeLines: expect to prepend a line", function () {
      var source = {x: [["1"]], y: [["2"]], color: [["green"]], size: [["3"]], tool: [["marker"]], drag: [["1"]]}

      lineManager.startLine(0, 1, "red", 5, "marker",  "0");
      lineManager.mergeLines(source);

      data = lineManager.getRawData();
      expect(data.x).toEqual([["1"], ["0"]]);
      expect(data.y).toEqual([["2"], ["1"]]);
      expect(data.color).toEqual([["green"], ["red"]]);
      expect(data.size).toEqual([["3"], ["5"]]);
      expect(data.tool).toEqual([["marker"], ["marker"]]);
      expect(data.drag).toEqual([["1"], ["0"]]);
    });
  });

  describe("interactive mode", function () {

    beforeEach(function () {
      lineManager = new LineManager();
      lineManager.interactiveKey = "1qaz2wsx3e";
      spyOn($, 'post');
    });

    it("#sync: clear", function () {
      lineManager.clearAll();

      expect($.post).toHaveBeenCalledWith(
        '/clear/1qaz2wsx3e',
        'json'
      );
    });

    it("#sync: merge", function () {
      lineManager.startLine(0, 1, "red", 5, "marker",  "0");
      lineManager.endLine();

      expect($.post).toHaveBeenCalledWith(
       '/push/1qaz2wsx3e',
        { data: { x: ["0"], y: ["1"], color: ["red"], size: ["5"], tool: ["marker"], drag: ["0"] }  },
        'json'
      );
    });
  });
});