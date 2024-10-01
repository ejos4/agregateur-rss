import { describe, test } from "@jest/globals";
import { XML_DOM } from "./XML_DOM";
import { loadFile, resolvePath } from "../../utilities";

const loadTestFile = (filepath: string) => loadFile(resolvePath(filepath));

describe("The XML_DOM class", () => {
  describe("can load a simple xml file", () => {
    test("The object and the root element isn't null and have the correct name value.", () => {
      const filename = "xml_simple1.xml";
      const dataString = loadTestFile(`./data/${filename}`);

      if (dataString !== undefined) {
        const xmlDOM = XML_DOM.load(dataString);

        expect(xmlDOM).not.toBeNull();
        if (xmlDOM !== null) {
          expect(xmlDOM.root).not.toBeNull();
          expect(xmlDOM.root?.name).toBe("Orders");
        }
      } else {
        throw new Error(`The file "${filename}" can't load for unkonw reason.`);
      }
    });

    test("The child of the root object is not null and have the correct name value.", () => {
      const filename = "xml_simple2.xml";
      const dataString = loadTestFile(`./data/${filename}`);

      if (dataString !== undefined) {
        const xmlDOM = XML_DOM.load(dataString);
        const children = xmlDOM?.root?.getChildren();

        expect(children).not.toBeUndefined();
        expect(children).not.toBeNull();
        if (xmlDOM !== null) {
          expect(xmlDOM.root).not.toBeNull();
          expect(xmlDOM.root?.name).toBe("Orders");
        }
        if (children !== null && children !== undefined) {
          expect(children.length).toBe(1);
          expect(children[0].name).toBe("Order");
        }
      } else {
        throw new Error(`The file "${filename}" can't load for unkonw reason.`);
      }
    });

    test("The children of the child object are not null and have the correct name value.", () => {
      const filename = "xml_simple3.xml";
      const dataString = loadTestFile(`./data/${filename}`);

      if (dataString !== undefined) {
        const xmlDOM = XML_DOM.load(dataString);
        const children = xmlDOM?.root?.getChildren();

        expect(children).not.toBeUndefined();
        expect(children).not.toBeNull();
        if (xmlDOM !== null) {
          expect(xmlDOM.root).not.toBeNull();
          expect(xmlDOM.root?.name).toBe("Orders");
        }
        if (children !== null && children !== undefined) {
          expect(children.length).toBe(1);
          expect(children[0].name).toBe("Order");

          const subChildren = children[0].getChildren();
          expect(subChildren?.length).toBe(2);
          if (subChildren !== null) {
            [
              ["OrderNo", "1"],
              ["CustomerNo", "99"],
            ].map(([name, value], index) => {
              expect(subChildren[index].name).toBe(name);
              expect(subChildren[index].text).toBe(value);
            });
          }
        }
      } else {
        throw new Error(`The file "${filename}" can't load for unkonw reason.`);
      }
    });
  });

  describe("can load a medium xml file", () => {
    test("The root object have more than one child with multiple sub children.", () => {
      const filename = "xml_medium1.xml";
      const dataString = loadTestFile(`./data/${filename}`);

      if (dataString !== undefined) {
        const xmlDOM = XML_DOM.load(dataString);

        expect(xmlDOM).not.toBeNull();
        expect(xmlDOM?.root).not.toBeNull();

        const root = xmlDOM?.root;
        if (root !== null && root !== undefined) {
          expect(root.defaultNamespaceURL).toBe(
            "http://DataAccess.com/webservices/"
          );
          expect(root.getNamespaceURL("m")).toBe(
            "http://DataAccess.com/Customers/"
          );

          const children = root.getChildren();
          expect(children).not.toBeNull();
          expect(children?.length).toBe(2);
          if (children !== null) {
            for (const child of children) {
              expect(child.name).toBe("Order");
              const subChildren = child.getChildren();
              expect(subChildren).not.toBeNull();
              expect(subChildren?.length).toBe(2);
              if (subChildren !== null) {
                expect(subChildren[0].name).toBe("OrderNo");
                expect(subChildren[0].text).toBe(" 1  ");
                expect(subChildren[1].name).toBe("Customer");
                expect(subChildren[1].prefix).toBe("m");

                const subSubChildren = subChildren[1].getChildren();
                expect(subSubChildren).not.toBeNull();
                if (subSubChildren !== null) {
                  [
                    ["CustomerNo", "99", null],
                    ["CustomerName", "Fred", null],
                    ["CustomerDate", null, { date: "2024-10-12" }],
                  ].map(([name, value, attributes], index) => {
                    expect(subSubChildren[index].name).toBe(name);
                    value !== null &&
                      expect(subSubChildren[index].text).toBe(value);
                    attributes !== null &&
                      Object.entries(attributes).map(([key, v]) => {
                        expect(subSubChildren[index].getAttribute(key)).toBe(v);
                      });
                  });
                }
              }
            }
          }
        }
      } else {
        throw new Error(`The file "${filename}" can't load for unkonw reason.`);
      }
    });

    test("Handle multiple namespace, the prologue gets loaded correctly and comments don't block the load.", () => {
      const filename = "xml_medium2.xml";
      const dataString = loadTestFile(`./data/${filename}`);

      if (dataString !== undefined) {
        const xmlDOM = XML_DOM.load(dataString);

        expect(xmlDOM).not.toBeNull();
        expect(xmlDOM?.prologue).not.toBeNull();
        expect(xmlDOM?.prologue).not.toBeUndefined();
        const prologue = xmlDOM?.prologue;
        if (prologue !== null && prologue !== undefined) {
          expect(prologue.version).toBe("1.0");
          expect(prologue.encoding).toBe("UTF-8");
        }
        expect(xmlDOM?.root).not.toBeNull();

        const root = xmlDOM?.root;
        if (root !== null && root !== undefined) {
          const expectedNamespaces = {
            content: "http://purl.org/rss/1.0/modules/content/",
            media: "http://search.yahoo.com/mrss/",
            atom: "http://www.w3.org/2005/Atom",
            schema: "https://schema.org",
            m: "http://DataAccess.com/Customers/",
          };
          expect(root.defaultNamespaceURL).toBe(
            "http://DataAccess.com/webservices/"
          );
          Object.entries(expectedNamespaces).map(([prefix, namespaceURL]) => {
            expect(root.getNamespaceURL(prefix)).toBe(namespaceURL);
          });

          const children = root.getChildren();
          expect(children).not.toBeNull();
          expect(children?.length).toBe(1);
          if (children !== null) {
            for (const child of children) {
              expect(child.name).toBe("Order");
              const subChildren = child.getChildren();
              expect(subChildren).not.toBeNull();
              expect(subChildren?.length).toBe(3);
              if (subChildren !== null) {
                expect(subChildren[0].name).toBe("OrderNo");
                expect(subChildren[0].text).toBe(" 1  ");
                expect(subChildren[1].name).toBe("Customer");
                expect(subChildren[1].prefix).toBe("m");
                expect(subChildren[2].name).toBe("enclosure");
                const expectedAttributes = {
                  length: "243",
                  type: "image/png",
                  url: "https://www.sample.com/pictures/a-picture.png",
                };
                Object.entries(expectedAttributes).map(([key, value]) => {
                  expect(subChildren[2].getAttribute(key)).toBe(value);
                });

                const subSubChildren = subChildren[1].getChildren();
                expect(subSubChildren).not.toBeNull();
                if (subSubChildren !== null) {
                  [
                    ["CustomerNo", "99", null],
                    ["CustomerName", "Fred", null],
                    ["CustomerDate", null, { date: "2024-10-12" }],
                  ].map(([name, value, attributes], index) => {
                    expect(subSubChildren[index].name).toBe(name);
                    value !== null &&
                      expect(subSubChildren[index].text).toBe(value);
                    attributes !== null &&
                      Object.entries(attributes).map(([key, v]) => {
                        expect(subSubChildren[index].getAttribute(key)).toBe(v);
                      });
                  });
                }
              }
            }
          }
        }
      } else {
        throw new Error(`The file "${filename}" can't load for unkonw reason.`);
      }
    });
  });
});
