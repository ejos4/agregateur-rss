import { jest, test, describe } from "@jest/globals";
import { Leaf } from "./Tree";

type Value = string | number | boolean | object;

describe("The leaf class", () => {
  describe("for initial values and getter/setter for value:", () => {
    let newLeaf: Leaf<Value>;
    beforeEach(() => {
      newLeaf = new Leaf();
    });

    test("Is created empty.", () => {
      expect(newLeaf.getValue()).toBeNull();
    });

    test("Value can be modified.", () => {
      expect(newLeaf.getValue()).toBeNull();
      newLeaf.setValue("value");
      expect(newLeaf.getValue()).toBe("value");
    });

    test("Is created with no child.", () => {
      expect(newLeaf.getChildren()).toBeNull();
    });

    test("Is created with the correct value.", () => {
      const leaf1 = new Leaf("value");
      const leaf2 = new Leaf("value2");

      expect(leaf1.getValue()).toBe("value");
      expect(leaf2.getValue()).toBe("value2");
    });

    test("Is created with the correct children.", () => {
      const leaf1 = new Leaf("value");
      const leaf2 = new Leaf("value2");
      const leaf3 = new Leaf(null, [leaf1, leaf2]);

      expect(leaf3.getChildren()).toStrictEqual([leaf1, leaf2]);
    });
  });

  describe("for children getter and setter:", () => {
    let leaf1: Leaf<Value>;
    let leaf2: Leaf<Value>;
    let leaf3: Leaf<Value>;
    let leaf4: Leaf<Value>;
    let newLeaf: Leaf<Value>;

    beforeEach(() => {
      leaf1 = new Leaf("value1");
      leaf2 = new Leaf("value2");
      leaf3 = new Leaf("value3");
      leaf4 = new Leaf("value4");
      newLeaf = new Leaf(null, [leaf1, leaf2, leaf3, leaf4]);
    });

    test("Can return the first child.", () => {
      expect(newLeaf.getFirstChild()).toStrictEqual(leaf1);
    });

    test("Can return the last child.", () => {
      expect(newLeaf.getLastChild()).toStrictEqual(leaf4);
    });

    test("Can return the n-th child.", () => {
      expect(newLeaf.getChild(1)).toStrictEqual(leaf2);
      expect(newLeaf.getChild(2)).toStrictEqual(leaf3);
    });

    test("Can set the first child.", () => {
      const newValue = "newValue";
      newLeaf.setFirstChild(newValue);
      expect(newLeaf.getFirstChild()?.getValue()).toStrictEqual(newValue);
    });

    test("Can set the last child.", () => {
      const newValue = "newValue";
      newLeaf.setLastChild(newValue);
      expect(newLeaf.getLastChild()?.getValue()).toStrictEqual(newValue);
    });

    test("Can set the n-th child.", () => {
      const newValue1 = "newValue1";
      const newValue2 = "newValue2";
      newLeaf.setChild(1, newValue1);
      newLeaf.setChild(2, newValue2);
      expect(newLeaf.getChild(1)?.getValue()).toStrictEqual(newValue1);
      expect(newLeaf.getChild(2)?.getValue()).toStrictEqual(newValue2);
    });
  });

  describe("for adding and removing children:", () => {
    let leaf1: Leaf<Value>;
    let leaf2: Leaf<Value>;
    let newLeaf: Leaf<Value>;

    beforeEach(() => {
      leaf1 = new Leaf("value");
      leaf2 = new Leaf("value2");
      newLeaf = new Leaf(null, [leaf1, leaf2]);
    });

    test("Can add a child at first index", () => {
      const leaf = new Leaf(1);
      newLeaf.insertChildFirst(leaf);
      expect(newLeaf.getChildren()).toStrictEqual([leaf, leaf1, leaf2]);
    });

    test("Can add a child at last index", () => {
      const leaf = new Leaf(1);
      newLeaf.insertChildLast(leaf);
      expect(newLeaf.getChildren()).toStrictEqual([leaf1, leaf2, leaf]);
    });

    test.each([
      { value: "preOk", index: 0 },
      { value: "ok", index: 1 },
      { value: "newOk", index: 2 },
    ])(
      "Can receive a child with value($value) at index($index).",
      ({ value, index }) => {
        const leaf = new Leaf(value);
        newLeaf.insertChildAt(index, leaf);
        expect(newLeaf.getChild(index)).toStrictEqual(leaf);
      }
    );

    test("Can receive multiple children.", () => {
      [
        { value: "preOk", index: 0 },
        { value: "ok", index: 1 },
        { value: "newOk", index: 2 },
      ].map(({ value, index }) =>
        newLeaf.insertChildAt(index, new Leaf(value))
      );

      expect(newLeaf.getFirstChild()?.getValue()).toBe("preOk");
      expect(newLeaf.getChild(1)?.getValue()).toBe("ok");
      expect(newLeaf.getChild(2)?.getValue()).toBe("newOk");
    });

    test("Can remove a child at first index", () => {
      newLeaf.deleteFirstChild();
      expect(newLeaf.getChildren()).toStrictEqual([leaf2]);
    });

    test("Can remove a child at last index", () => {
      newLeaf.deleteLastChild();
      expect(newLeaf.getChildren()).toStrictEqual([leaf1]);
    });

    test.each([{ index: 1 }, { index: 0 }])(
      "Can remove a child at index $index.",
      ({ index }) => {
        const deletedLeaf = newLeaf.getChild(index);
        newLeaf.deleteChild(index);
        expect(newLeaf.getChildren()).not.toContain(deletedLeaf);
      }
    );

    test("Can remove multiple children.", () => {
      let childrenLength = newLeaf.getChildren()?.length || 0;
      while (childrenLength > 0) newLeaf.deleteChild(childrenLength-- - 1);

      expect(newLeaf.getChildren()).toBeNull();
    });
  });
});
