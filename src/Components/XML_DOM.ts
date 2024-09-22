import { XML_Element } from "./XML_Element";
import { loadFile, resolvePath } from "../utilities";

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

  get(name: string): XML_Element | null {
    return null;
  }

  insertBefore(targetElement: XML_Element, newElement: XML_Element): void {}

  insertAfter(targetElement: XML_Element, newElement: XML_Element): void {}

  delete(element: XML_Element) {}
}

// Return a single tag element with data (to sort it later)
function captureTag(
  dataString: string
): [{ tagName: string; isClosingTag: boolean; textContent: string }, string] {
  const dataArray = dataString.split("");
  let startTag = false;
  let endTag = false;
  let tagName = "";
  let isClosingTag = false;
  let previousChar = "";
  let textContent = "";

  while (dataArray.length > 0 && !endTag) {
    const char = dataArray.shift();

    if (char !== undefined) {
      if (char === "<") {
        startTag = true;
      } else if (char === ">") {
        if (previousChar === "/") isClosingTag = true;
        endTag = true;
      } else if (char === "/") {
        if (previousChar === "<") isClosingTag = true;
      } else if (startTag) {
        tagName += char;
      } else {
        textContent += char;
      }

      previousChar = char;
    }
  }

  return [{ tagName, isClosingTag, textContent }, dataArray.join("")];
}

// Return all the tag present in a string representing an XML document.
function captureAllTags(dataString: string): {
  tagContent: string;
  isClosingTag: boolean;
  textContent: string;
  attributeContent: string;
}[] {
  let tagStack = new Array();
  let dataLeft = dataString;
  let tagName, textContent, attributeContent: string;
  let isClosingTag: boolean;

  while (dataLeft.length > 0) {
    [{ tagName, isClosingTag, textContent }, dataLeft] = captureTag(dataLeft);
    let result = tagName.match(/(^[a-zA-Z|:]*) (.*)/);
    if (result === null) {
      attributeContent = "";
    } else {
      // Seperate the attributes value from the tag name
      tagName = result[1] || tagName;
      attributeContent = result[2] || "s";
    }
    tagStack.push({ tagName, isClosingTag, textContent, attributeContent });
  }

  return tagStack;
}

function convertTagStackToXML_DOM(dataString: string) {
  const tagStack = captureAllTags(dataString);
  let openedTagStack = new Array();

  while (tagStack.length > 0) {
    const currentTag = tagStack.shift();

    if (currentTag) {
      if (currentTag.isClosingTag && openedTagStack[0] && openedTagStack[0]) {
      }
    }
  }
}

const RSSSample1 = loadFile(resolvePath("./data/xml_medium1.xml"));
if (RSSSample1 !== undefined) {
  console.log(RSSSample1, "\n");
  const data = RSSSample1.replace(/\r/g, "")
    .replace(/\n/g, "")
    .replace(/\t/g, "")
    .replace(/> *</g, "><");
  // console.log(data,"\n");
  console.log(captureAllTags(data));
}
//     console.log(loadXML(RSSSample1))
