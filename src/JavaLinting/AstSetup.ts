// @ts-nocheck
import { parse } from "java-ast";
import fs from "fs";

const SetAstArr = (filename) => {
    const code = fs.readFileSync(`./LintFolder/${filename}.java`,{
        flag:"r",
        encoding:"utf8"
    })
    
    const art = []
    
    const setarr = parse(code)
    
    
    const ade = (ktr) => {
        ktr.children.map(i => {
            if(i.children){
                art.push({name : i.constructor.name, text: code.substring(i.start.start,i.stop.stop+1)})
            }
        })
    }
    
    ade(setarr)
    
    
    const ClassFunNames = []
    
    art?.forEach((i)=>{
        if(i.text.length > 1){
            const vax = i.text.replace(/(?:\/\/.*)|(\/\*(?:.|[\n\r])*?\*\/)/,"")
            const gh = vax.match(/[\w\s]+=/g)
            if(gh !== null){
                gh.map(ix => {
                    const spearr = ix.split(" ")
                    const vald = spearr[spearr.indexOf("=")-1]
                    ClassFunNames.push(vald)
                })
            }
            const testval = vax.match(/(class|void|int|String) [\w]+/g)
            testval.forEach(iv => {
                ClassFunNames.push(iv.split(" ")[1])
            })
        }
    })
    
    const Finalvalarr = []
    ClassFunNames.map(i => {
        if(Finalvalarr.indexOf(i) === -1){
            Finalvalarr.push(i)
        }
    })
    
    return Finalvalarr;
}

export default SetAstArr;