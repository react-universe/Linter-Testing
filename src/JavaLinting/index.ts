// @ts-nocheck
import SoloExecute from "./execute"
import CallArr from "./grammar"
import fs from "fs"
import { exec } from "child_process"

const RestructureVal = (vallint) => {
    let RestructuredLinter = []
    vallint.forEach((item)=>{
        RestructuredLinter.push({
            Line : item.line,
            StartIndex : item.startindex,
            Severity : "Error",
            Message : item.ErrorString
        })
    })
    return RestructuredLinter;
}

const ActiveSetup = async(res,codetext,filename) => {
        let LinterArr = []
        let countme = 0;
        let lengthRem;
        let AllowRem = false;
        // const TextVal = fs.readFileSync(`./LintFolder/${filename}.java`,{encoding:"utf8",flag:"r"})
        const javalint = await SoloExecute(filename,res)
        const GrammarErr =  await CallArr(codetext,filename)
        const JResp = setInterval(()=>{
            if(!AllowRem && fs.existsSync("javaerr.json")){
                const JavaErrSyntax = JSON.parse(fs.readFileSync("javaerr.json",{encoding:"utf8",flag:"r"}));
                if(countme <= 4){
                    if(lengthRem !== JavaErrSyntax.array.length){
                        lengthRem = JavaErrSyntax.array.length;
                        countme = 0;
                    }
                    countme++
                }else{
                    AllowRem = true;
                }
            }
            if(AllowRem && fs.existsSync("javaerr.json")){
                clearInterval(JResp)
                const JavaErrSyntax = JSON.parse(fs.readFileSync("javaerr.json",{encoding:"utf8",flag:"r"}));
                GrammarErr.forEach((item)=>{
                    JavaErrSyntax.array.push(item)
                })
                LinterArr = JavaErrSyntax.array;
                const valRes = RestructureVal(LinterArr)
                // return LinterArr;
                const cox = valRes.sort((a,b)=> parseInt(a.Line) - parseInt(b.Line))
                exec(`npx rimraf ./javaerr.json ./filename.txt ./LintFolder/${filename}.java`)
                res.json(cox)
            }
        },1500)
}

export default ActiveSetup;