class Leaf<V> {
  // @ts-ignore
  private #node: V | null;
  private children: Leaf<V>[] | null;

  constructor(nodeValue: V | null = null, children: Leaf<V>[] | null = null) {
    this.#node = nodeValue;
    this.children = children;
  }

  // -------- Value methods --------

  getValue(): V | null {
    return this.#node;
  }

  setValue(newValue: V): void {
    this.#node = newValue;
  }

  // -------- Childs getter --------

  getChildren(): Leaf<V>[] | null {
    return this.children;
  }

  getChild(index: number): Leaf<V> | null {
    if (this.children === null) return null;
    if (index >= 0 && index < this.children.length) return this.children[index];
    return null;
  }

  getFirstChild(): Leaf<V> | null {
    return this.getChild(0);
  }

  getLastChild(): Leaf<V> | null {
    if (this.children === null) return null;
    return this.getChild(this.children.length - 1);
  }

  // -------- Childs setter --------

  setChildren(newValue: Leaf<V>[]): void {
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

  insertChildAt(index: number, newLeaf: Leaf<V>): void {
    if (this.children === null) {
      this.children = [newLeaf];
      return;
    }
    if (index <= 0) {
      this.children = [newLeaf, ...this.children];
      return;
    } else if (index >= this.children.length) {
      this.children = [...this.children, newLeaf];
      return;
    } else {
      this.children = [
        ...this.children.slice(0, index),
        newLeaf,
        ...this.children.slice(index),
      ];
    }
  }

  insertChildFirst(newLeaf: Leaf<V>): void {
    this.insertChildAt(0, newLeaf);
  }

  insertChildLast(newLeaf: Leaf<V>): void {
    this.insertChildAt(this.children?.length || 1, newLeaf);
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
}

export { Leaf };
