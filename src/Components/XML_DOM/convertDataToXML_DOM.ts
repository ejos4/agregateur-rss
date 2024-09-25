import { XML_DOM } from "./XML_DOM";
import { XML_Element } from "./XML_Element";

function removeQuoteFromString(str:string):string {
    let newStr = str;
    const quotesArray = ['"', "'", "`"];
    for (const quote of quotesArray) {
        while(newStr.includes(quote)) {
            newStr = newStr.replace(quote, "");
        }
    }

    return newStr;
}

// Return a single tag element with data (to sort it later)
function captureTag(dataString: string): [
  {
    tagName: string;
    isClosingTag: boolean;
    selfClosingTag: boolean;
    textContent: string;
  },
  string
] {
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
        else {
          // Avoid adding it to tagName if it represent a self closing element
          if (startTag && previousChar !== '"') tagName += char;
          else textContent += char;
        }
      } else if (startTag) {
        tagName += char;
      } else {
        textContent += char;
      }

      previousChar = char;
    }
  }

  return [
    { tagName, isClosingTag, selfClosingTag, textContent },
    dataArray.join(""),
  ];
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
    [{ tagName, isClosingTag, selfClosingTag, textContent }, dataLeft] =
      captureTag(dataLeft);
    let result = tagName.match(/(^[a-zA-Z|:]*) (.*)/);
    if (result === null) {
      attributeContent = "";
    } else {
      // Seperate the attributes value from the tag name
      tagName = result[1] || tagName;
      attributeContent = result[2] || "";
    }

    tagStack.push({
      tagName,
      isClosingTag,
      selfClosingTag,
      textContent,
      attributeContent,
    });
  }

  return tagStack;
}

function buildAttributesFromString(
  attributesString: string
): [string, string][] | null {
  if (attributesString === "") return null;
  const attributesArray = attributesString.split(/ +/);
  const stringQuoteArray = ['"', "'", "`"];
  let result: [string, string][] | null = null;

  for (let currentAttribute of attributesArray) {
    let [key, value] = currentAttribute.split("=");
    if (key !== "" && value !== "") {
      if (
        stringQuoteArray.includes(value[0]) &&
        stringQuoteArray.includes(value[value.length - 1])
      ) {
        if (result === null) result = new Array<[string, string]>();
        result.push([removeQuoteFromString(key), removeQuoteFromString(value)]);
      } else {
        console.error(
          `Invalid attribute value entered with key ${key}, quotes are lacking with the value : ${value}.`
        );
      }
    } else {
      console.error(
        `Invalid attribute entered with key/value pair: ${currentAttribute}.`
      );
    }
  }

  return result;
}

export default function convertDataToXML_DOM(
  dataString: string
): XML_DOM | null {
  const prologueData = {};
  // Check if prologue present at first line and store it
  if (dataString[0] === "<" && dataString[1] === "?") {
    let regexResult = dataString.match(/<\? ?xml(.*)\?>/);
    
    if (regexResult === null) {
      console.error(
        "Error with the prologue part: no closing tag found or uncorrect format."
      );
    } else {
      let [_, prologueString] = regexResult;
      if (prologueString !== undefined || prologueString !== "") {
        let prologueDataArray = prologueString
          .split(/ +/)
          .map((v) => v.split("="));
        for (let [key, value] of prologueDataArray)
          if (key !== "" || (value !== "" && value !== undefined))
            Object.assign(prologueData, { [`${removeQuoteFromString(key)}`]: removeQuoteFromString(value) });
      }
    }

    dataString = dataString.replace(/<\?.*\?>/, "");
  }

  const tagStack = captureAllTags(dataString);
  let firstTag = tagStack.shift();

  if (firstTag !== undefined) {
    const xmlDOM = new XML_DOM();
    let rootTree: XML_Element = new XML_Element(
      firstTag.tagName,
      buildAttributesFromString(firstTag.attributeContent)
    );
    let currentTree: XML_Element = rootTree;
    let openedTagStack = new Array<string>(firstTag.tagName);

    while (tagStack.length > 0) {
      let currentElement = tagStack.shift();

      if (currentElement) {
        if (openedTagStack[0] === currentElement.tagName) {
          currentTree.text = currentElement.textContent;
          if (currentTree.parent !== null) currentTree = currentTree.parent;
          openedTagStack.shift();
        } else if (currentElement.selfClosingTag) {
          let temp = new XML_Element(
            currentElement.tagName,
            buildAttributesFromString(currentElement.attributeContent)
          );
          currentTree.insertChildLast(temp);
        } else {
          let temp = new XML_Element(
            currentElement.tagName,
            buildAttributesFromString(currentElement.attributeContent)
          );
          currentTree.insertChildLast(temp);
          currentTree = temp;
          openedTagStack.unshift(currentElement.tagName);
        }
      }
    }

    xmlDOM.prologue = prologueData;
    xmlDOM.root = rootTree;
    return xmlDOM;
  }

  return null;
}
