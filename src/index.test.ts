import {expect, test, describe} from "@jest/globals";
import {resolvePath, loadFile} from "./utilities";
// const {resolvePath, loadFile} = require("./utilities");
const {getRSSFeed} = require("./index");

describe("The RSS Feed", () => {

    test.todo("is getting data correctly")
    // test("is getting data correctly", () => {
    //     const RSSSample1 = loadFile(resolvePath("./data/rss_sample1.xml"))

    //     if (RSSSample1) {
    //         const RSS_XML = getRSSFeed(RSSSample1);

    //         expect(RSS_XML).not.toBe(null)
    //     }
    // });

    test.todo("can be tested for required attributes");
    
    test.todo("returns articles");
})