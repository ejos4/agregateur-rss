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

      expect(xml2.activeNamespaceURL).toBe(xml1.namespaces["f"]);
      expect(xml3.activeNamespaceURL).toBe(xml1.namespaces["f"]);
    });

    test("can populate the default namespace.", () => {
      xml1 = new XML_Element("table", [
        ["xmlns", "http://www.w3.org/TR/html4/"],
      ]);
      xml2 = new XML_Element("name", null, null, "African Coffee Table");
      xml3 = new XML_Element("width", null, null, "80");
      xml1.insertChildFirst(xml2);
      xml1.insertChildLast(xml3);

      expect(xml2.activeNamespaceURL).toBe(xml1.defaultNamespaceURL);
      expect(xml3.activeNamespaceURL).toBe(xml1.defaultNamespaceURL);
    });

    test("can populate multiple namespace.", () => {
      let root = new XML_Element("root", [
        ["xmlns:h", "http://www.w3.org/TR/html4/"],
        ["xmlns:f", "https://www.w3schools.com/furniture"],
      ]);
      xml1 = new XML_Element("f:table");
      xml2 = new XML_Element("f:name", null, null, "African Coffee Table");
      xml3 = new XML_Element("f:width", null, null, "80");
      let xml4 = new XML_Element("h:table");
      let xml5 = new XML_Element("h:name", null, null, "Apples");
      let xml6 = new XML_Element("h:otherName", null, null, "Bananas");

      root.insertChildFirst(xml1);
      root.insertChildLast(xml4);
      xml1.insertChildFirst(xml2);
      xml1.insertChildLast(xml3);
      xml4.insertChildFirst(xml5);
      xml4.insertChildLast(xml6);

      expect(xml1.activeNamespaceURL).toBe(root.namespaces["f"]);
      expect(xml2.activeNamespaceURL).toBe(root.namespaces["f"]);
      expect(xml3.activeNamespaceURL).toBe(root.namespaces["f"]);
      expect(xml4.activeNamespaceURL).toBe(root.namespaces["h"]);
      expect(xml5.activeNamespaceURL).toBe(root.namespaces["h"]);
      expect(xml6.activeNamespaceURL).toBe(root.namespaces["h"]);
    });

    test("can populate multiple namespace with also a default namespace (1/2).", () => {
      let root = new XML_Element("root", [
        ["xmlns:h", "http://www.w3.org/TR/html4/"],
        ["xmlns:f", "https://www.w3schools.com/furniture"],
        ["xmlns", "https://sample.com/data"],
      ]);
      xml1 = new XML_Element("f:table");
      xml2 = new XML_Element("f:name", null, null, "African Coffee Table");
      xml3 = new XML_Element("f:width", null, null, "80");
      let xml4 = new XML_Element("h:table");
      let xml5 = new XML_Element("h:name", null, null, "Apples");
      let xml6 = new XML_Element("h:otherName", null, null, "Bananas");
      let xml7 = new XML_Element("table");
      let xml8 = new XML_Element("name", null, null, "Apples");
      let xml9 = new XML_Element("otherName", null, null, "Bananas");

      root.insertChildFirst(xml1);
      root.insertChildLast(xml4);
      root.insertChildLast(xml7);
      xml1.insertChildFirst(xml2);
      xml1.insertChildLast(xml3);
      xml4.insertChildFirst(xml5);
      xml4.insertChildLast(xml6);
      xml7.insertChildFirst(xml8);
      xml7.insertChildLast(xml9);

      expect(xml1.activeNamespaceURL).toBe(root.namespaces["f"]);
      expect(xml2.activeNamespaceURL).toBe(root.namespaces["f"]);
      expect(xml3.activeNamespaceURL).toBe(root.namespaces["f"]);
      expect(xml4.activeNamespaceURL).toBe(root.namespaces["h"]);
      expect(xml5.activeNamespaceURL).toBe(root.namespaces["h"]);
      expect(xml6.activeNamespaceURL).toBe(root.namespaces["h"]);
      expect(xml7.activeNamespaceURL).toBe(root.defaultNamespaceURL);
      expect(xml8.activeNamespaceURL).toBe(root.defaultNamespaceURL);
      expect(xml9.activeNamespaceURL).toBe(root.defaultNamespaceURL);
    });

    test("can populate multiple namespace with also a default namespace (2/2).", () => {
      let root = new XML_Element("Orders", [
        ["xmlns:m", "http://www.w3.org/TR/html4/"],
        ["xmlns:x", ""],
        ["xmlns", "https://sample.com/data"],
      ]);
      xml1 = new XML_Element("x:Order");
      xml2 = new XML_Element("OrderNo", null, null, "1");
      xml3 = new XML_Element("m:Customer");
      const xml4 = new XML_Element("m:CustomerNo", null, null, "99");
      const xml5 = new XML_Element("x:State", null, null, "CA");
      const xml6 = new XML_Element("m:State", null, null, "Angry");
      const xml7 = new XML_Element("State", null, null, "Yes");

      root.insertChildFirst(xml1);
      xml1.insertChildLast(xml2);
      xml1.insertChildLast(xml3);
      xml3.insertChildLast(xml4);
      xml3.insertChildLast(xml5);
      xml3.insertChildLast(xml6);
      xml3.insertChildLast(xml7);

      expect(xml1.activeNamespaceURL).toBe(root.namespaces["x"]);
      expect(xml2.activeNamespaceURL).toBe(root.defaultNamespaceURL);
      expect(xml3.activeNamespaceURL).toBe(root.namespaces["m"]);
      expect(xml4.activeNamespaceURL).toBe(root.namespaces["m"]);
      expect(xml5.activeNamespaceURL).toBe(root.namespaces["x"]);
      expect(xml6.activeNamespaceURL).toBe(root.namespaces["m"]);
      expect(xml7.activeNamespaceURL).toBe(root.defaultNamespaceURL);
    });
  });
});
