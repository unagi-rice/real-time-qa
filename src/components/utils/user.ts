import { Node } from '@milkdown/prose/model';
import { v1 as uuidv1 } from 'uuid';
import { inject } from 'vue';
import { questionBank} from '../Types';


export const getId = (node?: Node) => {node?.attrs?.['identity'] || uuidv1()};


export const questionBankStorage = {
  content:JSON.parse(localStorage.getItem("questionBanks") ?? JSON.stringify([])), // questionBank's are saved locally in browser
  save:(storage_in?:questionBank)=>localStorage.setItem("questionBanks", storage_in ?? questionBankStorage.content),
}

function exportData(content:any, fileName:string, contentType:any) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}