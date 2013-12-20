describe("dataStack:", function () {

  describe("single user mode", function () {
    beforeEach(function () {
      dataStack = new DataStack();
    });

    it("#push: expect to update data arrays", function () {
      dataStack.push(1, 2, "red", 5, "marker",  "0");

      expect(dataStack.clickX).toEqual(["1"]);
      expect(dataStack.clickY).toEqual(["2"]);
      expect(dataStack.clickColor).toEqual(["red"]);
      expect(dataStack.clickSize).toEqual(["5"]);
      expect(dataStack.clickTool).toEqual(["marker"]);
      expect(dataStack.clickDrag).toEqual(["0"]);
    });

    it("#pop: expect to remove data", function () {
      dataStack.push(0, 1, "red", 5, "marker", "0");
      dataStack.push(1, 2, "red", 5, "marker", "0");
      dataStack.push(2, 4, "red", 5, "marker", "1");
      dataStack.push(3, 6, "red", 5, "marker", "1");

      dataStack.pop();
      expect(dataStack.clickX).toEqual(["0"]);
      expect(dataStack.clickY).toEqual(["1"]);
      expect(dataStack.clickColor).toEqual(["red"]);
      expect(dataStack.clickSize).toEqual(["5"]);
      expect(dataStack.clickTool).toEqual(["marker"]);
      expect(dataStack.clickDrag).toEqual(["0"]);
    });

    it("#clear: expect to clear all arrays", function () {
      dataStack.push(0, 1, "red", 5, "marker",  "0");

      dataStack.clear();

      expect(dataStack.clickX).toEqual([]);
      expect(dataStack.clickY).toEqual([]);
      expect(dataStack.clickColor).toEqual([]);
      expect(dataStack.clickSize).toEqual([]);
      expect(dataStack.clickTool).toEqual([]);
      expect(dataStack.clickDrag).toEqual([]);
    });

    it("#replace: expect to replace all arrays", function () {
      data = {x: ["1"], y: ["2"], color: ["green"], size: ["3"], tool: ["marker"], drag: ["1"]}

      dataStack.push(0, 1, "red", 5, "marker",  "0");
      dataStack.replace(data);

      expect(dataStack.clickX).toEqual(["1"]);
      expect(dataStack.clickY).toEqual(["2"]);
      expect(dataStack.clickColor).toEqual(["green"]);
      expect(dataStack.clickSize).toEqual(["3"]);
      expect(dataStack.clickTool).toEqual(["marker"]);
      expect(dataStack.clickDrag).toEqual(["1"]);
    });
  });

  // How to test API
  describe("interactive mode", function () {

    beforeEach(function () {
      dataStack = new DataStack();
      dataStack.interactiveKey = "1qaz2wsx3e"
      spyOn($, 'post');
    });

    it("#sync: clear", function () {
      dataStack.sync();

      expect($.post).toHaveBeenCalledWith(
        '/push/1qaz2wsx3e',
        { data: { x: [], y: [], color: [], size: [], tool: [], drag: [] }, action: 'clear' },
        'json'
      );
    });

    it("#sync: merge", function () {
      dataStack.push(0, 1, "red", 5, "marker",  "0");
      dataStack.sync();

      expect($.post).toHaveBeenCalledWith(
       '/push/1qaz2wsx3e',
        { data: { x: ["0"], y: ["1"], color: ["red"], size: ["5"], tool: ["marker"], drag: ["0"] }, action: 'merge' },
        'json'
      );
    });
  });
});