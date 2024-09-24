import { XML_Element } from "./XML_Element";
import { loadFile, resolvePath } from "../utilities";
import { Tree } from "./Tree/Tree";

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
): [{ tagName: string; isClosingTag: boolean; selfClosingTag: boolean; textContent: string }, string] {
  const dataArray = dataString.split("");
  let startTag = false;
  let endTag = false;
  let tagName = "";
  let isClosingTag = false;
  let selfClosingTag = false;
  let previousChar = "";
  let textContent = "";

  while (dataArray.length > 0 && !endTag) {
    const char = dataArray.shift();

    if (char !== undefined) {
      if (char === "<") {
        startTag = true;
      } else if (char === ">") {
        if (previousChar === "/") selfClosingTag = true;
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

  return [{ tagName, isClosingTag, selfClosingTag, textContent }, dataArray.join("")];
}

// Return all the tag present in a string representing an XML document.
function captureAllTags(dataString: string): {
  tagName: string;
  isClosingTag: boolean;
  selfClosingTag: boolean;
  textContent: string;
  attributeContent: string;
}[] {
  let tagStack = new Array();
  let dataLeft = dataString;
  let tagName, textContent, attributeContent: string;
  let isClosingTag, selfClosingTag: boolean;

  while (dataLeft.length > 0) {
    [{ tagName, isClosingTag, selfClosingTag, textContent }, dataLeft] = captureTag(dataLeft);
    let result = tagName.match(/(^[a-zA-Z|:]*) (.*)/);
    if (result === null) {
      attributeContent = "";
    } else {
      // Seperate the attributes value from the tag name
      tagName = result[1] || tagName;
      attributeContent = result[2] || "";
    }
    
    tagStack.push({ tagName, isClosingTag, selfClosingTag, textContent, attributeContent });
  }

  return tagStack;
}


interface XMLData {
  name:string;
  content:string;
  attributes:string;
}

function convertTagStackToTree(dataString: string):Tree<XMLData>|null {
  const tagStack = captureAllTags(dataString);
  let firstTag = tagStack.shift();

  if (firstTag !== undefined) {
    let rootTree:Tree<XMLData> = new Tree({name: firstTag.tagName, content: "", attributes: firstTag.attributeContent});
    let currentTree:Tree<XMLData> = rootTree;
    let openedTagStack = new Array<string>(firstTag.tagName);

    while (tagStack.length > 0) {
      let currentElement = tagStack.shift();

      if (currentElement){

        if (openedTagStack[0] === currentElement.tagName) {
         
          let currentValue = currentTree.getValue();
          let attributes = "";
          if (currentValue)
            attributes = currentValue.attributes;

          currentTree.setValue({
            name: currentElement.tagName,
            content: currentElement.textContent,
            attributes: attributes
          })
          if (currentTree.parent !== null)
            currentTree = currentTree.parent;
          openedTagStack.shift();

        } else if (currentElement.selfClosingTag) {
          
          let temp = new Tree({name: currentElement.tagName, content: "", attributes: currentElement.attributeContent});
          currentTree.insertChildLast(temp);
        
        } else {
        
          let temp = new Tree({name: currentElement.tagName, content: "", attributes: currentElement.attributeContent});
          currentTree.insertChildLast(temp);
          currentTree = temp;
          openedTagStack.unshift(currentElement.tagName)
        
        }
      }
    }

    return rootTree;
  }

  return null
}

function convertDataToXML_DOM(dataString: string):XML_Element|null {
  function buildAttributesFromString(attributesString:string):[string,string][]|null {
    if (attributesString === "") return null;
    const attributesArray = attributesString.split(/ +/);
    const stringQuoteArray = ["\"", "\'", "\`"]
    let result:[string,string][]|null = null;
  
    for (let currentAttribute of attributesArray) {
      let [key, value] = currentAttribute.split("=")
      if (key !== "" && value !== "") {
        if (stringQuoteArray.includes(value[0]) && stringQuoteArray.includes(value[value.length - 1])) {
          if (result === null) result = new Array<[string,string]>()
          result.push([key, value]);
        } else {
          console.error(`Invalid attribute value entered with key ${key}, quotes are lacking with the value : ${value}.`);
        }
      } else {
        console.error(`Invalid attribute entered with key/value pair: ${currentAttribute}.`);
      }
    }

    return result;
  }
  const tagStack = captureAllTags(dataString);
  let firstTag = tagStack.shift();

  if (firstTag !== undefined) {
    let rootTree:XML_Element = new XML_Element(firstTag.tagName, buildAttributesFromString(firstTag.attributeContent));
    let currentTree:XML_Element = rootTree;
    let openedTagStack = new Array<string>(firstTag.tagName);

    while (tagStack.length > 0) {
      let currentElement = tagStack.shift();

      if (currentElement){

        if (openedTagStack[0] === currentElement.tagName) {
          currentTree.text = currentElement.textContent
          if (currentTree.parent !== null)
            currentTree = currentTree.parent;
          openedTagStack.shift();

        } else if (currentElement.selfClosingTag) {
          
          let temp = new XML_Element(currentElement.tagName, buildAttributesFromString(currentElement.attributeContent));
          currentTree.insertChildLast(temp);
        
        } else {
        
          let temp = new XML_Element(currentElement.tagName, buildAttributesFromString(currentElement.attributeContent));
          currentTree.insertChildLast(temp);
          currentTree = temp;
          openedTagStack.unshift(currentElement.tagName)
        
        }
      }
    }

    return rootTree;
  }

  return null
}

function buildXML_ElementFromXMLData(data:XMLData):XML_Element {
  const {name, attributes, content} = data;
  let newElement = new XML_Element(name, null, null, content);
  const attributesArray = attributes.split(/ +/);
  const stringQuoteArray = ["\"", "\'", "\`"]

  for (let currentAttribute of attributesArray) {
    let [key, value] = currentAttribute.split("=")
    if (key !== "" && value !== "") {
      if (stringQuoteArray.includes(value[0]) && stringQuoteArray.includes(value[value.length - 1])) {
        newElement.addAttribute(key, value)
      } else {
        console.error(`Invalid attribute value entered with key ${key}, quotes are lacking with the value : ${value}.`);
      }
    } else {
      console.error(`Invalid attribute entered with key/value pair: ${currentAttribute}.`);
    }
  }

  return newElement
}

const RSSSample1 = loadFile(resolvePath("../src/data/rss_sample1.xml"));
if (RSSSample1 !== undefined) {
  // console.log(RSSSample1, "\n");
  // const data = RSSSample1
  const data = RSSSample1.replace(/\r/g, "")
    .replace(/\n/g, "")
    .replace(/\t/g, "")
    .replace(/(<!\[CDATA\[)(.*)(\]\]>)/g, "$2")
    // .replace(/> *</g, "><");
  // console.log(data,"\n");
  // @ts-ignore
  // console.dir(convertTagStackToXML_DOM(data));
  convertDataToXML_DOM(data).display();
}
//     console.log(loadXML(RSSSample1))
