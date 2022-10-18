import {parse} from "java-ast"
import fs from "fs"

const Hexio = () => {
    const filename = fs.readFileSync("filename.txt",{encoding:"utf8",flag:"r"})
    const code = fs.readFileSync(`./LintFolder/${filename}.java`,{
        encoding : "utf8",
        flag : "r"
    })
    
    parse(code)
}

Hexio()