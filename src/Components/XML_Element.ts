import { Tree } from "./Tree/Tree";

type Value = string | number | boolean | object;
interface XML_Attributes {
    [key:string]: string
}

class XML_Element extends Tree<string>{
    parent:Tree<string>|null=null;
    name:string;
    prefix:string|null=null;
    // @ts-ignore
    private #attributes:XML_Attributes={};
    namespacePrefix:string|null=null;
    namespaceURL:string|null=null;
    // @ts-ignore
    private #isDefaultNamespace:boolean=false;
    // @ts-ignore
    private #id=-1;
    text="";

    constructor(tagName:string, attributes:[string, string][]|null=null, children:XML_Element[]|null=null, text:string|null=null) {
        super(tagName)
        this.name = tagName;
        if (children !== null)
            this.setChildren(children)

        if (attributes !== null) {
            attributes.map(([key, value]) => {
                Object.assign(this.#attributes, {[`${key}`]: value})
            })

        }

        if (text !== null) 
            this.text = text;

        this.init();
    }

    init(){
        let attributesKey = Object.keys(this.#attributes);
        
        // Initializing the namespace
        const namespaceKey = attributesKey.find(key => key.includes("xmlns"))
        if (namespaceKey !== undefined) {   // Setting namespace prefix if prefix is given with attribute key/value pair
            const [_, namespacePrefix] = namespaceKey.split(":");
            // @ts-ignore
            const namespaceURL = this.#attributes[namespaceKey];
            
            if (namespaceURL !== undefined && namespaceURL !== ""){
                this.namespaceURL = namespaceURL
            }

            if (namespacePrefix === undefined)
                this.#isDefaultNamespace = true;
            else
                this.namespacePrefix = namespacePrefix;

        } else if (this.name.includes(":")) {   // Setting namespace prefix if prefix is given with tag name
            const [namespacePrefix, realName] = this.name.split(":");
            this.namespacePrefix = namespacePrefix;
            this.name = realName;
            // Should lookup to see if parent has a given namespaceURL for that prefix or not
        } else if (false) { // Lookup to see if parent has a default namespace
            // Not implemented
        }
    }

    getIsDefaultNamespace():boolean { return this.#isDefaultNamespace }

    isEmpty():boolean {
        if (this.getChildren() === null && this.text === "") return true;
        return false
    }

    setValue(newValue: string): void {
        super.setValue(newValue);
        this.name = newValue;
    }

    // -------------- Get & Set attributes --------------

    getAttribute(attributeName:string):string {
        return this.#attributes[attributeName] || "";
    }
    
    setAttribute(attributeName:string, newAttributeValue:string) {
        if (!Object.keys(this.#attributes).includes(attributeName)) {
            console.error(`The attribute of name :${attributeName} doesn't exist for the element :${this.name}.`);
            return;
        }
        this.#attributes[attributeName] = newAttributeValue;
    }

    // -------------- Managing id --------------

    setId(newId:number) { this.#id = newId }

    getId():number { return this.#id }



}

let xml1 = new XML_Element("table", [["path", "djelsokfre"], ["aria-checked", "true"], ["xmlns:f", "http://www.w3.org/TR/html4/"]])
let xml2 = new XML_Element("f:name", [["path", "djelsokfre"], ["aria-checked", "true"]], null, "African Coffee Table")
let xml3 = new XML_Element("f:width", [["path", "djelsokfre"], ["aria-checked", "true"]], null, "80")

xml1.insertChildFirst(xml2);
xml1.insertChildLast(xml3);

console.dir(xml1)