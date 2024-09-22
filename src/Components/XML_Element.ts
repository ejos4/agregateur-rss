import { Tree } from "./Tree/Tree";

interface Dictionnary {
  [key: string]: string;
}
interface XML_Attributes extends Dictionnary {}
interface Namespaces extends Dictionnary {}

class XML_Element extends Tree<string> {
  parent: XML_Element | null = null;
  name: string;
  prefix: string | null = null;
  // @ts-ignore
  private #attributes: XML_Attributes = {};
  namespaces: Namespaces = {}; // Store the namespaces given by attributes.
  defaultNamespaceURL: string | null = null; // Store the defined default namespace given by attribute.
  activeNamespaceURL: string | null = null; // Store the namespace for the element if prefix given.
  // @ts-ignore
  private #containDefaultNamespace: boolean = false;
  // @ts-ignore
  private #id = -1;
  text = ""; // Store the text content of the element.

  constructor(
    tagName: string,
    attributes: [string, string][] | null = null,
    children: XML_Element[] | null = null,
    text: string | null = null
  ) {
    super(tagName);
    let [prefix, name] = tagName.split(":");
    if (name !== undefined) {
      this.prefix = prefix;
      this.name = name;
    } else {
      this.name = prefix;
    }
    if (children !== null) this.setChildren(children);

    if (attributes !== null) {
      attributes.map(([key, value]) => {
        Object.assign(this.#attributes, { [`${key}`]: value });
      });
    }

    if (text !== null) this.text = text;

    this.initNamespace();
  }

  isEmpty(): boolean {
    if (this.getChildren() === null && this.text === "") return true;
    return false;
  }
  
  setValue(newValue: string): void {
    super.setValue(newValue);
    this.name = newValue;
  }

  // -------------- Managing namespaces --------------
  
  // Return the corresponding namespaceURL for a given namespacePrefix
  getNamespaceURL(namespacePrefix: string): string | null {
    for (let [currentNamespacePrefix, currentNamespaceURL] of Object.entries(
      this.namespaces
    )) {
      if (namespacePrefix === currentNamespacePrefix)
        return currentNamespaceURL;
    }
    return null;
  }

  // Store the namespaces given by attributes and define default namespace if they are present
  initNamespace() {
    let attributesKey = Object.entries(this.#attributes);
    const namespaces = attributesKey.filter(([key, _]) =>
      key.includes("xmlns")
    );

    if (namespaces.length !== 0) {
      for (let [namespaceKey, namespaceURL] of namespaces) {
        let [_, namespacePrefix] = namespaceKey.split(":");

        // If the namespaceKey is "xmlns" namespacePrefix should be undefined and it's the default namespace
        if (namespacePrefix === undefined) {
          this.#containDefaultNamespace = true;
          this.defaultNamespaceURL = namespaceURL;
        } else {
          Object.assign(this.namespaces, {
            [`${namespacePrefix}`]: namespaceURL,
          });
        }
      }
    }
  }

  updateNamespace() {
    // Populate the namespace
    if (this.activeNamespaceURL === null || this.activeNamespaceURL === "") {
      let currentParent = this.parent;
      let currentPrefix = this.prefix;

      while (currentParent !== null) {
        let relatedParentNamespaceURL: string | null = null;

        if (currentPrefix !== null) {
          relatedParentNamespaceURL =
            currentParent.getNamespaceURL(currentPrefix);
          if (relatedParentNamespaceURL !== null) {
            this.activeNamespaceURL = relatedParentNamespaceURL;
            return;
          }
        } else if (
          currentParent.#containDefaultNamespace &&
          currentPrefix === null
        ) {
          this.activeNamespaceURL = currentParent.defaultNamespaceURL;
          return;
        }

        currentParent = currentParent.parent;
      }
    }
  }

  // -------------- Get & Set attributes --------------

  getAttribute(attributeName: string): string {
    return this.#attributes[attributeName] || "";
  }

  setAttribute(attributeName: string, newAttributeValue: string) {
    if (!Object.keys(this.#attributes).includes(attributeName)) {
      console.error(
        `The attribute of name :${attributeName} doesn't exist for the element :${this.name}.`
      );
      return;
    }
    this.#attributes[attributeName] = newAttributeValue;
  }

  // -------------- Get & Set id --------------

  setId(newId: number) {
    this.#id = newId;
  }

  getId(): number {
    return this.#id;
  }

  // -------------- Insert element --------------

  insertChildAt(index: number, xmlChild: XML_Element): void {
    super.insertChildAt(index, xmlChild);
    xmlChild.parent = this;
    xmlChild.updateNamespace()
  }

  insertChildFirst(xmlChild: XML_Element) {
    super.insertChildFirst(xmlChild);
    xmlChild.parent = this;
    xmlChild.updateNamespace();
  }

  insertChildLast(xmlChild: XML_Element): void {
    super.insertChildLast(xmlChild);
    xmlChild.parent = this;
    xmlChild.updateNamespace();
  }
}

export { XML_Element };