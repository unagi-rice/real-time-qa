import { Node } from '@milkdown/prose/model';
import { v1 as uuidv1 } from 'uuid';
import { inject } from 'vue';
import { answerBank, questionBank} from '../Types';


export const getId = (node?: Node) => {node?.attrs?.['identity'] || uuidv1()};

/**
 * collection of questions in localStorage
 */
export const questionBankStorage = {
  content:()=>JSON.parse(localStorage.getItem("questionBanks") ?? JSON.stringify([])), // questionBank's are saved locally in browser
  save:(storage_in?:questionBank[])=>localStorage.setItem("questionBanks", JSON.stringify(storage_in ?? questionBankStorage.content())),
  /**
   * insert a questionBank into storage, if it exists already in storage, then replace the existing one with new one
   * @param questionBank_in 
   */
  add:(questionBank_in:questionBank)=>{
    let currContent = questionBankStorage.content();
    let matchInd:number;
    if ((matchInd = currContent.findIndex((elem:questionBank)=>elem.id === questionBank_in.id)) !== -1)
    {
      currContent.splice(matchInd,1,structuredClone(questionBank_in));
    }
    else
    {
      currContent.push(structuredClone(questionBank_in));
    }
    questionBankStorage.save(currContent);
    },
  remove:(questionBankID:questionBank["id"])=>{
    let currContent = questionBankStorage.content();
    let matchInd:number;
    if ((matchInd = currContent.findIndex((elem:questionBank)=>elem.id === questionBankID)) !== -1)
    {
      currContent.splice(matchInd,1);
      questionBankStorage.save(currContent);
    }
  
  },
}
/**
 * collection of correct answers in localStorage, identified by their corresponding question id
 */
export const answerBankStorage = {
  content:()=>JSON.parse(localStorage.getItem("answerBanks") ?? JSON.stringify([])), // answerBank's are saved locally in browser
  save:(storage_in?:answerBank[])=>localStorage.setItem("answerBanks", JSON.stringify(storage_in ?? answerBankStorage.content())),
    /**
   * insert a answerBank into storage, if it exists already in storage, then replace the existing one with new one
   * @param answerBank_in 
   */
  add:(answerBank_in:answerBank)=>{
    let currContent = answerBankStorage.content();
    let matchInd:number;
    if ((matchInd = currContent.findIndex((elem:answerBank)=>elem.id === answerBank_in.id)) !== -1)
    {
      currContent.splice(matchInd,1,structuredClone(answerBank_in));
    }
    else
    {
      currContent.push(structuredClone(answerBank_in));
    }
    answerBankStorage.save(currContent);
    },
  remove:(answerBankID:answerBank["qid"])=>{
    let currContent = answerBankStorage.content();
    let matchInd:number;
    if ((matchInd = currContent.findIndex((elem:answerBank)=>elem.qid === answerBankID)) !== -1)
    {
      currContent.splice(matchInd,1);
      answerBankStorage.save(currContent);
    }
  
  },
}
export function exportData(content:any, fileName:string, contentType:any) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}