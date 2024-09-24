class Tree<V> {
  // @ts-ignore
  private #node: V | null;
  parent: Tree<V> | null;
  private children: Tree<V>[] | null;

  constructor(nodeValue: V | null = null, children: Tree<V>[] | null = null) {
    this.#node = nodeValue;
    this.children = children;
    this.parent = null;
  }

  // -------- Value methods --------

  getValue(): V | null {
    return this.#node;
  }

  setValue(newValue: V): void {
    this.#node = newValue;
  }

  getValueString():string {
    return JSON.stringify(this.#node)
  }

  // -------- Childs getter --------

  getChildren(): Tree<V>[] | null {
    return this.children;
  }

  getChild(index: number): Tree<V> | null {
    if (this.children === null) return null;
    if (index >= 0 && index < this.children.length) return this.children[index];
    return null;
  }

  getFirstChild(): Tree<V> | null {
    return this.getChild(0);
  }

  getLastChild(): Tree<V> | null {
    if (this.children === null) return null;
    return this.getChild(this.children.length - 1);
  }

  // -------- Childs setter --------

  setChildren(newValue: Tree<V>[]): void {
    this.children = newValue;
  }

  setChild(index: number, newValue: V): void {
    if (this.children === null) {
      console.error(
        `Impossible to set child at index ${index}, children list is "null".`
      );
      return;
    }
    if (index < 0 && index >= this.children.length) {
      console.error(
        `Impossible to set child at index ${index}, the index is out of bounds.`
      );
      return;
    }
    this.children[index].setValue(newValue);
  }

  setFirstChild(newValue: V): void {
    if (this.children === null) {
      console.error(
        `Impossible to set first child with value: ${newValue}, children list is "null".`
      );
      return;
    }
    this.setChild(0, newValue);
  }

  setLastChild(newValue: V): void {
    if (this.children === null) {
      console.error(
        `Impossible to set last child with value: ${newValue}, children list is "null".`
      );
      return;
    }
    this.setChild(this.children.length - 1, newValue);
  }

  // -------- Childs insert --------

  insertChildAt(index: number, newTree: Tree<V>): void {
    newTree.parent = this;
    newTree.parent = this;
    if (this.children === null) {
      this.children = [newTree];
      return;
    }
    if (index <= 0) {
      this.children = [newTree, ...this.children];
      return;
    } else if (index >= this.children.length) {
      this.children = [...this.children, newTree];
      return;
    } else {
      this.children = [
        ...this.children.slice(0, index),
        newTree,
        ...this.children.slice(index),
      ];
    }
  }

  insertChildFirst(newTree: Tree<V>): void {
    newTree.parent = this;
    this.insertChildAt(0, newTree);
  }

  insertChildLast(newTree: Tree<V>): void {
    newTree.parent = this;
    this.insertChildAt(this.children?.length || 1, newTree);
  }

  // -------- Childs delete --------

  deleteChild(index: number): void {
    if (this.children === null) {
      return;
    }
    if (index < 0 && index >= this.children.length) {
      console.error(
        `Impossible to delete child at index ${index}, the index is out of bounds.`
      );
      return;
    }
    this.children = [
      ...this.children.slice(0, index),
      ...this.children.slice(index + 1),
    ];
    if (this.children.length === 0) this.children = null;
  }

  deleteFirstChild(): void {
    this.deleteChild(0);
  }

  deleteLastChild(): void {
    if (this.children === null) {
      return;
    }
    this.deleteChild(this.children.length - 1);
  }

  getMaxDepth(acc=1):number{
    const children = this.getChildren();

    if(children === null) return acc;
    else {
      let maxDepth = 0;

      for (let i=0; i < children.length; i++) {
        const currentDepth = children[i].getMaxDepth(acc + 1);
        if (maxDepth < currentDepth)
          maxDepth = currentDepth
      }

      return maxDepth;
    }
  }

  display() {
    console.log(this.getValueString())
    const children = this.getChildren()
    if ( children === null) return;

    let temp = children.map(child => [1, child]);
    while (temp.length !== 0) {
      type data = [number, Tree<V>]
      // @ts-ignore
      let [depth, child]:data = temp.shift();
      let childValue = child.getValue();
      let lineToPrint = "";
      const subChildren = child.getChildren();
      let childValueString = (childValue === null) ? "#" : this.getValueString();

      // @ts-ignore
      if (depth !== 1 && temp.filter(([tDepth, _]) => tDepth<2).length)
        lineToPrint += "|";
      
      for (let i=0; i < depth; i++) {
        if (i === depth-1)
          lineToPrint += "+---";
        else
          lineToPrint += "    ";
      }
      lineToPrint += " "
      lineToPrint += childValueString;

      if (subChildren !== null) {
        for (let i = subChildren.length - 1; i >= 0; i--) {
          temp.unshift([depth+1, subChildren[i]])
        }
      }

      console.log(lineToPrint);
    }

  }
}

export { Tree };