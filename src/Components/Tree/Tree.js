"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _Tree_node;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
var Tree = /** @class */ (function () {
    function Tree(nodeValue, children) {
        if (nodeValue === void 0) { nodeValue = null; }
        if (children === void 0) { children = null; }
        // @ts-ignore
        _Tree_node.set(this, void 0);
        __classPrivateFieldSet(this, _Tree_node, nodeValue, "f");
        this.children = children;
    }
    // -------- Value methods --------
    Tree.prototype.getValue = function () {
        return __classPrivateFieldGet(this, _Tree_node, "f");
    };
    Tree.prototype.setValue = function (newValue) {
        __classPrivateFieldSet(this, _Tree_node, newValue, "f");
    };
    // -------- Childs getter --------
    Tree.prototype.getChildren = function () {
        return this.children;
    };
    Tree.prototype.getChild = function (index) {
        if (this.children === null)
            return null;
        if (index >= 0 && index < this.children.length)
            return this.children[index];
        return null;
    };
    Tree.prototype.getFirstChild = function () {
        return this.getChild(0);
    };
    Tree.prototype.getLastChild = function () {
        if (this.children === null)
            return null;
        return this.getChild(this.children.length - 1);
    };
    // -------- Childs setter --------
    Tree.prototype.setChildren = function (newValue) {
        this.children = newValue;
    };
    Tree.prototype.setChild = function (index, newValue) {
        if (this.children === null) {
            console.error("Impossible to set child at index ".concat(index, ", children list is \"null\"."));
            return;
        }
        if (index < 0 && index >= this.children.length) {
            console.error("Impossible to set child at index ".concat(index, ", the index is out of bounds."));
            return;
        }
        this.children[index].setValue(newValue);
    };
    Tree.prototype.setFirstChild = function (newValue) {
        if (this.children === null) {
            console.error("Impossible to set first child with value: ".concat(newValue, ", children list is \"null\"."));
            return;
        }
        this.setChild(0, newValue);
    };
    Tree.prototype.setLastChild = function (newValue) {
        if (this.children === null) {
            console.error("Impossible to set last child with value: ".concat(newValue, ", children list is \"null\"."));
            return;
        }
        this.setChild(this.children.length - 1, newValue);
    };
    // -------- Childs insert --------
    Tree.prototype.insertChildAt = function (index, newTree) {
        if (this.children === null) {
            this.children = [newTree];
            return;
        }
        if (index <= 0) {
            this.children = __spreadArray([newTree], this.children, true);
            return;
        }
        else if (index >= this.children.length) {
            this.children = __spreadArray(__spreadArray([], this.children, true), [newTree], false);
            return;
        }
        else {
            this.children = __spreadArray(__spreadArray(__spreadArray([], this.children.slice(0, index), true), [
                newTree
            ], false), this.children.slice(index), true);
        }
    };
    Tree.prototype.insertChildFirst = function (newTree) {
        this.insertChildAt(0, newTree);
    };
    Tree.prototype.insertChildLast = function (newTree) {
        var _a;
        this.insertChildAt(((_a = this.children) === null || _a === void 0 ? void 0 : _a.length) || 1, newTree);
    };
    // -------- Childs delete --------
    Tree.prototype.deleteChild = function (index) {
        if (this.children === null) {
            return;
        }
        if (index < 0 && index >= this.children.length) {
            console.error("Impossible to delete child at index ".concat(index, ", the index is out of bounds."));
            return;
        }
        this.children = __spreadArray(__spreadArray([], this.children.slice(0, index), true), this.children.slice(index + 1), true);
        if (this.children.length === 0)
            this.children = null;
    };
    Tree.prototype.deleteFirstChild = function () {
        this.deleteChild(0);
    };
    Tree.prototype.deleteLastChild = function () {
        if (this.children === null) {
            return;
        }
        this.deleteChild(this.children.length - 1);
    };
    Tree.prototype.getMaxDepth = function (acc) {
        if (acc === void 0) { acc = 1; }
        var children = this.getChildren();
        if (children === null)
            return acc;
        else {
            var maxDepth = 0;
            for (var i = 0; i < children.length; i++) {
                var currentDepth = children[i].getMaxDepth(acc + 1);
                if (maxDepth < currentDepth)
                    maxDepth = currentDepth;
            }
            return maxDepth;
        }
    };
    Tree.prototype.display = function () {
        console.log(this.getValue());
        var children = this.getChildren();
        if (children === null)
            return;
        var temp = children.map(function (child) { return [1, child]; });
        while (temp.length !== 0) {
            // @ts-ignore
            var _a = temp.shift(), depth = _a[0], child = _a[1];
            var childValue = child.getValue();
            var lineToPrint = "";
            var subChildren = child.getChildren();
            var childValueString = (childValue === null) ? "#" : childValue;
            // @ts-ignore
            if (depth !== 1 && temp.filter(function (_a) {
                var tDepth = _a[0], _ = _a[1];
                return tDepth < 2;
            }).length)
                lineToPrint += "|";
            for (var i = 0; i < depth; i++) {
                if (i === depth - 1)
                    lineToPrint += "+---";
                else
                    lineToPrint += "    ";
            }
            lineToPrint += " ";
            lineToPrint += childValueString;
            if (subChildren !== null) {
                for (var i = subChildren.length - 1; i >= 0; i--) {
                    temp.unshift([depth + 1, subChildren[i]]);
                }
            }
            console.log(lineToPrint);
        }
    };
    return Tree;
}());
exports.Tree = Tree;
_Tree_node = new WeakMap();
// let tree1 = new Tree(2, [
//   new Tree(1),
//   new Tree(3)
// ])
// let tree2 = new Tree<string|number>('7', [
//   new Tree(2, [
//     new Tree(null, [
//       new Tree(3),
//       new Tree<string|number>("A", [
//         new Tree(0, [
//           new Tree(9)
//         ])
//       ])
//     ]),
//     new Tree(6, [
//       new Tree(4, [new Tree(5)]),
//     ])
//   ]),
//   new Tree(10, [new Tree(9)])
// ])
// console.log(tree2.getMaxDepth())
// console.log("\nDisplaying tree 1:");
// tree1.display()
// console.log("\nDisplaying tree 2:");
// tree2.display()
