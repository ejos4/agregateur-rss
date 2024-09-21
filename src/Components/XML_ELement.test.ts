import { jest, test, describe } from "@jest/globals";
import { XML_Element } from "./XML_Element";

describe("The XML_Element class", () => {
  describe("for the namespace management", () => {
    let xml1: XML_Element, xml2: XML_Element, xml3: XML_Element;

    test("can populate the namespace by prefix.", () => {
      xml1 = new XML_Element("table", [
        ["xmlns:f", "http://www.w3.org/TR/html4/"],
      ]);
      xml2 = new XML_Element("f:name", null, null, "African Coffee Table");
      xml3 = new XML_Element("f:width", null, null, "80");
      xml1.insertChildFirst(xml2);
      xml1.insertChildLast(xml3);

      expect(xml2.namespaceURL).toBe(xml1.namespaceURL);
      expect(xml3.namespaceURL).toBe(xml1.namespaceURL);
    });

    test("can populate the default namespace.", () => {
      xml1 = new XML_Element("table", [
        ["xmlns", "http://www.w3.org/TR/html4/"],
      ]);
      xml2 = new XML_Element("name", null, null, "African Coffee Table");
      xml3 = new XML_Element("width", null, null, "80");
      xml1.insertChildFirst(xml2);
      xml1.insertChildLast(xml3);

      expect(xml2.namespaceURL).toBe(xml1.namespaceURL);
      expect(xml3.namespaceURL).toBe(xml1.namespaceURL);
    });

    test.todo("can populate multiple namespace.");
    // test("can populate multiple namespace.", () => {
    //     let root = new XML_Element("root", [["xmlns:h", "http://www.w3.org/TR/html4/"],["xmlns:f", "https://www.w3schools.com/furniture"]])
    //     xml1 = new XML_Element("f:table")
    //     xml2 = new XML_Element("f:name", null, null, "African Coffee Table")
    //     xml3 = new XML_Element("f:width", null, null, "80");
    //     let xml4 = new XML_Element("h:table")
    //     let xml5 = new XML_Element("h:name", null, null, "Apples")
    //     let xml6 = new XML_Element("h:otherName", null, null, "Bananas");

    //     root.insertChildFirst(xml1);
    //     root.insertChildLast(xml4);
    //     xml1.insertChildFirst(xml2);
    //     xml1.insertChildLast(xml3);
    //     xml4.insertChildFirst(xml5);
    //     xml4.insertChildLast(xml6);

    //     expect(xml1.namespaceURL).toBe(root.name);
    //     expect(xml3.namespaceURL).toBe(xml1.namespaceURL);

    // });

    test.todo("can populate multiple namespace with also a default namespace.");
    // test("can populate multiple namespace with also a default namespace.", () => {
    //     let root = new XML_Element("root", [["xmlns:h", "http://www.w3.org/TR/html4/"],["xmlns:f", "https://www.w3schools.com/furniture"],["xmlns", "https://sample.com/data"]])
    //     xml1 = new XML_Element("f:table")
    //     xml2 = new XML_Element("f:name", null, null, "African Coffee Table")
    //     xml3 = new XML_Element("f:width", null, null, "80");
    //     let xml4 = new XML_Element("h:table")
    //     let xml5 = new XML_Element("h:name", null, null, "Apples")
    //     let xml6 = new XML_Element("h:otherName", null, null, "Bananas");
    //     let xml7 = new XML_Element("table")
    //     let xml8 = new XML_Element("name", null, null, "Apples")
    //     let xml9 = new XML_Element("otherName", null, null, "Bananas");

    //     root.insertChildFirst(xml1);
    //     root.insertChildLast(xml4);
    //     root.insertChildLast(xml7);
    //     xml1.insertChildFirst(xml2);
    //     xml1.insertChildLast(xml3);
    //     xml4.insertChildFirst(xml5);
    //     xml4.insertChildLast(xml6);
    //     xml7.insertChildFirst(xml8);
    //     xml7.insertChildLast(xml9);

    //     // expect(xml1.namespaceURL).to(root.namespaceURL);
    //     // expect(xml1.namespaceURL).toBe(root.name);
    //     // expect(xml1.namespaceURL).toBe(root.name);
    //     // expect(xml2.namespaceURL).toBe(xml1.namespaceURL);
    //     // expect(xml3.namespaceURL).toBe(xml1.namespaceURL);

    // });
  });
});
