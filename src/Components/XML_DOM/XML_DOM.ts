import { XML_Element } from "./XML_Element";
import { loadFile, resolvePath } from "../../utilities";
import convertDataToXML_DOM from "./convertDataToXML_DOM";
import { decode } from "punycode";

interface Dictionnary {
  [key: string]: string;
}

class XML_DOM {
  prologue: Dictionnary | null = null;
  root: XML_Element | null = null;

  static createFromString(dataString: string): XML_DOM | null {
    return null;
  }

  // @ts-ignore
  private #buildId() {}

  get(name: string): XML_Element[] {
    if (this.root !== null)
      return this.root.name === name
        ? [this.root, ...this.root.get(name)]
        : [...this.root.get(name)];
    return [];
  }

  insertBefore(targetElement: XML_Element, newElement: XML_Element): void {}

  insertAfter(targetElement: XML_Element, newElement: XML_Element): void {}

  delete(element: XML_Element) {}

  static load(rawData: string): XML_DOM | null {
    const data = rawData
      .replace(/\r/g, "")
      .replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/(<!\[CDATA\[)(.*)(\]\]>)/g, "$2")
      .replace(/<!--.*-->/g, "");

    return convertDataToXML_DOM(data);
  }
}

const RSSSample1 = loadFile(resolvePath("../src/data/endTest.rss"));
if (RSSSample1 !== undefined) {
  console.log("File loaded");
  const xmlDOM = XML_DOM.load(RSSSample1);
  if (xmlDOM !== null) {
    // xmlDOM.root?.display();
    console.log(xmlDOM.prologue);
    console.log(xmlDOM.get("item").length, "\n");
    console.log(xmlDOM.get("item")[0].get("title")[0].text);
  }
}

export { XML_DOM };
