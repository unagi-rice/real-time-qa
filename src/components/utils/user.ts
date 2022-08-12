import { Node } from '@milkdown/prose/model';
import { v1 as uuidv1 } from 'uuid';
import { inject } from 'vue';
import { questionBank,userType } from '../Types';


export const getId = (node?: Node) => {node?.attrs?.['identity'] || uuidv1()};

export function getQuestionBank(qid:string):questionBank | undefined
{
  const userStorage = inject<userType>('user');
  // TODO: design user storage

  return userStorage.questions[qid] | undefined; 
}
export function updateQuestionBank(uid:string):void {

}