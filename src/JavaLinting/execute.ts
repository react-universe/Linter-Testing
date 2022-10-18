// @ts-nocheck
import { exec } from "child_process"
import fs from "fs"

const SoloExecute = async(filename,res) => {
    const correctFileWithThrow = (line,errstr,ind) => {
        const CodeVal = fs.readFileSync(`./LintFolder/${filename}.java`,{
            flag : "r",
            encoding : "utf8"
        })
        const arrofval = CodeVal.split("\n")
        const vaNc = errstr.split(" ")[2].length-2
        const valc = arrofval[line - 1]
        const splitText = valc.split("")
        splitText.splice(ind,vaNc)
        const TextWalk = splitText.join("")
        arrofval[line-1] = TextWalk;
        fs.writeFileSync(`./LintFolder/${filename}.java`,arrofval.join("\n"),{
            encoding:"utf8",
            flag:"w"
        });
        CallJavaLint()
    }
    
    
    const correctFile = (line,ind,err) => {
        const CodeVal = fs.readFileSync(`./LintFolder/${filename}.java`,{
            flag : "r",
            encoding : "utf8"
        })
        let findLast;
        const arrofval = CodeVal.split("\n")
        for(let i=line-2;i >= 0;i--){
            const twist = arrofval[i].replace(/(?:\/\/.*)|(\/\*(?:.|[\n\r])*?\*\/)/,"")
            if(twist !== ""){
                const wordarr = twist.split("")
                const dVal = wordarr.filter(ix => ix !== " " && ix !== "\r")
                if(dVal.length){
                    findLast = i;
                    break;
                }
            }
        }
        if(!findLast){
            storeErr(line,ind,err)
            CallJavaLint();
            return;
        }
        const SecArr = arrofval[findLast]
        let onexe = true;
        let indofsec;
        const arrOfSec = SecArr.split("")
        const soloSec = arrOfSec.reverse().map((secarr,ins)=>{
            if(onexe && secarr !== "\r" && secarr !== " "){
                indofsec = ins;
                onexe = false;
            }
            return secarr
        })
        const Exactslice = soloSec.splice(indofsec,1)
        storeErr(findLast+1,indofsec,`errors found in ${Exactslice}`)
        const FinalCorrect = soloSec.reverse().join("")
        arrofval[findLast] = FinalCorrect;
        fs.writeFileSync(`./LintFolder/${filename}.java`,arrofval.join("\n"),{
            encoding:"utf8",
            flag:"w"
        });
        CallJavaLint()
    }
    
    const convertLine = (strVal) => {
        if(strVal.match(/[0-9]*:[0-9]*/) !== null){
            const [linenum,indexnum] = strVal.match(/[0-9]*:[0-9]*/)[0].split(":")
            const ErrStr = strVal.replace(/line [0-9]*:[0-9]*/,"") 
            return {linenum,indexnum,ErrStr}
        }
        return {linenum:0,indexnum:0,ErrStr:"Exit shell"}
    }
    
    
    const storeErr = (line,index,errstr) => {
        let subarr = fs.existsSync("javaerr.json") ? JSON.parse(fs.readFileSync("javaerr.json",{encoding:"utf8",flag:"r"})) : {
            array : []
        }
        subarr.array.push({
            line: `${line}`,
            startindex : `${parseInt(index)+1}`,
            ErrorString : errstr
        })
        fs.writeFileSync("javaerr.json",JSON.stringify(subarr),{
            encoding:"utf8",
            flag : "w"
        })
    }
    
    const MissingOps = (line,ind,strerr) => {
        const CodeVal = fs.readFileSync(`./LintFolder/${filename}.java`,{
            flag : "r",
            encoding : "utf8"
        })
        const arrofval = CodeVal.split("\n")
        for(let i = line-2; i >= 0; i--){
            const twist = arrofval[i].replace(/(?:\/\/.*)|(\/\*(?:.|[\n\r])*?\*\/)/,"")
            if(twist.match(/[\w]+/)){
                storeErr(i+1,twist.length,strerr)
                break;
            }
        }
    }
    
    const CallJavaLint = async() => {
        exec("npm run execute1",(err,sout,serr)=>{
            if(serr){
                const errstr = serr.split("\n")
                errstr.every((item,index)=>{
                    if(item){
                        const {linenum,indexnum,ErrStr} = convertLine(item)
                        if(ErrStr !== "Exit shell"){
                            // res.status(504).json({Message : "Shell Error"})
                            if(item.includes("extraneous input") && linenum !== 1){
                                const valmatch = item.match(/{([^}]+)}/g)
                                const specLit = valmatch[0].split("")
                                specLit.pop()
                                specLit.shift()
                                const arrOFExpect = specLit.join("").split(",")
                                if(arrOFExpect.includes("<EOF>") || arrOFExpect.includes("'throws'")){
                                    correctFileWithThrow(linenum,ErrStr,indexnum)
                                    storeErr(linenum,indexnum,ErrStr.trim().split(" ").slice(0,3).join(" "))
                                    return false;
                                }
                                correctFile(linenum,indexnum,ErrStr)
                                return false;
                            }else if(item.includes("missing ")){
                                MissingOps(linenum,indexnum,ErrStr)
                            }else{
                                storeErr(linenum,indexnum,ErrStr)
                            }
                        }
                    }
                    return true;
                })
            }
        })
    }
    return CallJavaLint()
}

export default SoloExecute;