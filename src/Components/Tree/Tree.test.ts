import { jest, test, describe } from "@jest/globals";
import { Tree } from "./Tree";

type Value = string | number | boolean | object;

describe("The leaf class", () => {
  describe("for initial values and getter/setter for value:", () => {
    let newTree: Tree<Value>;
    beforeEach(() => {
      newTree = new Tree();
    });

    test("Is created empty.", () => {
      expect(newTree.getValue()).toBeNull();
    });

    test("Value can be modified.", () => {
      expect(newTree.getValue()).toBeNull();
      newTree.setValue("value");
      expect(newTree.getValue()).toBe("value");
    });

    test("Is created with no child.", () => {
      expect(newTree.getChildren()).toBeNull();
    });

    test("Is created with the correct value.", () => {
      const leaf1 = new Tree("value");
      const leaf2 = new Tree("value2");

      expect(leaf1.getValue()).toBe("value");
      expect(leaf2.getValue()).toBe("value2");
    });

    test("Is created with the correct children.", () => {
      const leaf1 = new Tree("value");
      const leaf2 = new Tree("value2");
      const leaf3 = new Tree(null, [leaf1, leaf2]);

      expect(leaf3.getChildren()).toStrictEqual([leaf1, leaf2]);
    });
  });

  describe("for children getter and setter:", () => {
    let leaf1: Tree<Value>;
    let leaf2: Tree<Value>;
    let leaf3: Tree<Value>;
    let leaf4: Tree<Value>;
    let newTree: Tree<Value>;

    beforeEach(() => {
      leaf1 = new Tree("value1");
      leaf2 = new Tree("value2");
      leaf3 = new Tree("value3");
      leaf4 = new Tree("value4");
      newTree = new Tree(null, [leaf1, leaf2, leaf3, leaf4]);
    });

    test("Can return the first child.", () => {
      expect(newTree.getFirstChild()).toStrictEqual(leaf1);
    });

    test("Can return the last child.", () => {
      expect(newTree.getLastChild()).toStrictEqual(leaf4);
    });

    test("Can return the n-th child.", () => {
      expect(newTree.getChild(1)).toStrictEqual(leaf2);
      expect(newTree.getChild(2)).toStrictEqual(leaf3);
    });

    test("Can set the first child.", () => {
      const newValue = "newValue";
      newTree.setFirstChild(newValue);
      expect(newTree.getFirstChild()?.getValue()).toStrictEqual(newValue);
    });

    test("Can set the last child.", () => {
      const newValue = "newValue";
      newTree.setLastChild(newValue);
      expect(newTree.getLastChild()?.getValue()).toStrictEqual(newValue);
    });

    test("Can set the n-th child.", () => {
      const newValue1 = "newValue1";
      const newValue2 = "newValue2";
      newTree.setChild(1, newValue1);
      newTree.setChild(2, newValue2);
      expect(newTree.getChild(1)?.getValue()).toStrictEqual(newValue1);
      expect(newTree.getChild(2)?.getValue()).toStrictEqual(newValue2);
    });
  });

  describe("for adding and removing children:", () => {
    let leaf1: Tree<Value>;
    let leaf2: Tree<Value>;
    let newTree: Tree<Value>;

    beforeEach(() => {
      leaf1 = new Tree("value");
      leaf2 = new Tree("value2");
      newTree = new Tree(null, [leaf1, leaf2]);
    });

    test("Can add a child at first index", () => {
      const leaf = new Tree(1);
      newTree.insertChildFirst(leaf);
      expect(newTree.getChildren()).toStrictEqual([leaf, leaf1, leaf2]);
    });

    test("Can add a child at last index", () => {
      const leaf = new Tree(1);
      newTree.insertChildLast(leaf);
      expect(newTree.getChildren()).toStrictEqual([leaf1, leaf2, leaf]);
    });

    test.each([
      { value: "preOk", index: 0 },
      { value: "ok", index: 1 },
      { value: "newOk", index: 2 },
    ])(
      "Can receive a child with value($value) at index($index).",
      ({ value, index }) => {
        const leaf = new Tree(value);
        newTree.insertChildAt(index, leaf);
        expect(newTree.getChild(index)).toStrictEqual(leaf);
      }
    );

    test("Can receive multiple children.", () => {
      [
        { value: "preOk", index: 0 },
        { value: "ok", index: 1 },
        { value: "newOk", index: 2 },
      ].map(({ value, index }) =>
        newTree.insertChildAt(index, new Tree(value))
      );

      expect(newTree.getFirstChild()?.getValue()).toBe("preOk");
      expect(newTree.getChild(1)?.getValue()).toBe("ok");
      expect(newTree.getChild(2)?.getValue()).toBe("newOk");
    });

    test("Can remove a child at first index", () => {
      newTree.deleteFirstChild();
      expect(newTree.getChildren()).toStrictEqual([leaf2]);
    });

    test("Can remove a child at last index", () => {
      newTree.deleteLastChild();
      expect(newTree.getChildren()).toStrictEqual([leaf1]);
    });

    test.each([{ index: 1 }, { index: 0 }])(
      "Can remove a child at index $index.",
      ({ index }) => {
        const deletedTree = newTree.getChild(index);
        newTree.deleteChild(index);
        expect(newTree.getChildren()).not.toContain(deletedTree);
      }
    );

    test("Can remove multiple children.", () => {
      let childrenLength = newTree.getChildren()?.length || 0;
      while (childrenLength > 0) newTree.deleteChild(childrenLength-- - 1);

      expect(newTree.getChildren()).toBeNull();
    });
  });
});
