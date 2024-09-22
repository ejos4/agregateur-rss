import { readFileSync } from "node:fs";
import { resolve} from "node:path";

const resolvePath = (relativePath:string) => resolve(__dirname, relativePath)

function loadFile(filePath:string) {
    try {
        const data = readFileSync(filePath, 'utf8');
        return data
    } catch (err) {
        console.error(err);
    }
}

export {resolvePath, loadFile}