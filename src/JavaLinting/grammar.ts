// @ts-nocheck
import axios from "axios";
import fs from "fs";
import SetAstArr from "./AstSetup";
import IgnoreList from "./constantval";

export async function GrammarCollect(text){
    const encodedParams = new URLSearchParams();
    encodedParams.append("language", "en-US");
    encodedParams.append("text",text);
    
    const options = {
      method: 'POST',
      url: 'https://dnaber-languagetool.p.rapidapi.com/v2/check',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '6c636c2948mshebe555b9cd9a1cep1f3430jsn6813b19356a3',
        'X-RapidAPI-Host': 'dnaber-languagetool.p.rapidapi.com'
      },
      data: encodedParams
    };

    let arr = [];
    
    await axios.request(options).then(function(response) {
        arr = response.data.matches.filter((i) => i.rule.issueType === "misspelling");
    }).catch(function(error) {
      console.error(error);
    });

    return arr;
}


const ErrorDesign = (grammar,gramText) => {
    let DiagnoseArr = []
    grammar.map((item)=>{
        const word = gramText.substring(item.offset).slice(0,item.length);
        const wordrep = item.replacements[0]?.value;
        const ReplaceMentsSetup = item.replacements.filter((i) => IgnoreList.indexOf(i.value) !== -1);
        if(ReplaceMentsSetup.length && IgnoreList.indexOf(word) === -1 && !wordrep?.includes(" ")){
            gramText.split("\n").map((i,ind)=>{
                const matcher = new RegExp(`\\b(${word})\\b`,"g");
                if(i.match(matcher) !== null){
                    DiagnoseArr.push({
                        line : ind+1,
                        startindex : i.indexOf(word)+1,
                        ErrorString : `${word} cannot be resolved`
                    });
                }
            });
        }
    });
    return DiagnoseArr;
}

const CallArr = async(gramText,filename) => {
    SetAstArr(filename).forEach(ival => {
        IgnoreList.push(ival)
    })
    const vals = await GrammarCollect(gramText)
    const resp = ErrorDesign(vals,gramText)
    return resp;
}

export default CallArr;