import { Leaf } from "./Tree/Tree";

type Value = string | number | boolean | object;
type XML_Attributes = [string, string]

class XML_Element extends Leaf<Value>{
    name:string;
    prefix:string|null=null;
    attributes:object={};
    namespace:string|null=null;
    id:number=-1;

    constructor(tagName:string, attributes?:XML_Attributes[], children?:XML_Element[]) {
        super(tagName)
        this.name = tagName;
        if (children !== undefined)
            this.setChildren(children)

        if (attributes !== undefined) {
            attributes.map(([key, value]) => {
                Object.assign(this.attributes, {[`${key}`]: value})
            })

        }
    }

    setValue(newValue: string): void {
        super.setValue(newValue);
        this.name = newValue;
    }
}

// let xml1 = new XML_Element("svg", [["path", "djelsokfre"], ["aria-checked", "true"]])
// let xml2 = new XML_Element("svg", [["path", "djelsokfre"], ["aria-checked", "true"]])
// let xml3 = new XML_Element("svg", [["path", "djelsokfre"], ["aria-checked", "true"]])

// xml1.insertChildFirst(xml2);
// xml1.insertChildLast(xml3);

// console.dir(xml1)