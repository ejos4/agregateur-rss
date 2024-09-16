import fs from "node:fs"
import path from "node:path";

const resolvePath = (relativePath:string) => path.resolve(__dirname, relativePath)

function loadFile(filePath:string) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data
    } catch (err) {
        console.error(err);
    }
}

export {resolvePath, loadFile}