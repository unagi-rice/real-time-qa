import { id } from 'element-plus/es/locale';
import {v1 as getuuid} from 'uuid'
// NOTICE: record interfaces here
export enum interfaces{
    EmptyInterface,
    ExampleCounter,
    StatsInterface,
    IndividualStatsInterface,
    QuestionEditInterface,
    QuestionAnswerInterface,
  }


// 题目
// 选择题部件
export enum objectiveQuestionType {
    Multi,           // 选择题
    UnorderedSequence, // 多选题
    // OrderedSequence="ordered_seq"
    FillBlank, // 填空题
    
  }
export type objectiveAnswerKeyType = (number | string)

export interface objectiveAnswerContainer {
    readonly id: string
    readonly type: string,     // 
    choice?: {[key :objectiveAnswerKeyType]:string}, // [a:content1,b,c,d]
    correctAnswer: objectiveAnswerKeyType | objectiveAnswerKeyType[], // matching id-type
    set setCorrectAnswer(newAnswer:objectiveAnswerKeyType | objectiveAnswerKeyType[]);
    test(chosen:objectiveAnswerKeyType | objectiveAnswerKeyType[]):boolean;
}
export class multiChoice implements objectiveAnswerContainer{
  readonly id = getuuid();
  readonly type = objectiveQuestionType[objectiveQuestionType.Multi];
  choice:{[key :objectiveAnswerKeyType]:string} = {}
  correctAnswer: objectiveAnswerKeyType = "";
    
  constructor(choice:{[key:objectiveAnswerKeyType]:string}) {
    this.choice = choice;
  }
  set setCorrectAnswer(newAnswer: objectiveAnswerKeyType) {
    if (this.choice[newAnswer] !== undefined)
    {
      this.correctAnswer = newAnswer;
    }
  }
  test(chosen:objectiveAnswerKeyType){
    return chosen == this.correctAnswer;
  }
}

export class unorderedSequenceChoice implements objectiveAnswerContainer{
  readonly id = getuuid();
  readonly type = objectiveQuestionType[objectiveQuestionType.UnorderedSequence];
  choice:{[key :objectiveAnswerKeyType]:string} = {}
  correctAnswer: objectiveAnswerKeyType[] = [];

  constructor(choice:{[key:objectiveAnswerKeyType]:string}) {
    this.choice = choice;
  }
  set setCorrectAnswer(newAnswer: objectiveAnswerKeyType[]) {
    let flag = true;
    for (var opt in newAnswer) {
      if (this.choice[opt] === undefined) {
        flag = false;
      }
    }
    if (flag)
    {
      this.correctAnswer = newAnswer;
    }
  }
  test(chosen:objectiveAnswerKeyType[]) {
    for (var opt in chosen) {
      if (!this.correctAnswer.includes(opt)) {
        return false;
      }
    }
    return true;
  }
}


export class fillBlank implements objectiveAnswerContainer{
  readonly id = getuuid();
  readonly type = objectiveQuestionType[objectiveQuestionType.FillBlank];
  correctAnswer: string = '';

  constructor(){

  }
  set setCorrectAnswer(newAnswer: string) {
      // TODO: determine if need to let teacher read the answer
    this.correctAnswer = newAnswer;
  }
  test(chosen:string){
    return chosen == this.correctAnswer;
  }
}

export enum subjectiveQuestionType {
    FreeResponse= 'free_res',      // 文字主观题
}
// 主观题部件
// 主观题部件
export interface subjectiveAnswerContainer <contentType=string>{
  readonly id:number,
  readonly type:string,
  marking:(answer:contentType)=>boolean
}
export const  questionType = {...objectiveQuestionType , ...subjectiveQuestionType};
export type questionType = typeof questionType;
export type answerContainer = objectiveAnswerContainer | subjectiveAnswerContainer;

export interface question {
  id: number;
  content: (string | objectiveAnswerContainer | subjectiveAnswerContainer)[];
}

export interface answer {
  id: number;
  content: {[key: number]: (string | number | number[])}
}

export function defaultTestMultiChoice() {
    let newQuestion = <question>
          { id: 0,
            content:[
                "你的老婆是谁？",
                new multiChoice({1:"两仪式", 
                             2:"两仪式 ❤", 
                             3:"两仪式 ❤❤", 
                             4:"两仪式 ❤❤❤"}),
            ]};
    return newQuestion;
}

export function defaultTestUnorderedSequenceChoice(){
  let newQuestion = <question>{ id: 0,
    content:[
        "你的老婆是谁？",
        new unorderedSequenceChoice({1:"两仪式", 
                     2:"两仪式 ❤", 
                     3:"两仪式 ❤❤", 
                     4:"两仪式 ❤❤❤"}),
    ]};
  return newQuestion;
}

export function defaultTestFillBlank(){
  let newQuestion = <question>{ id: 0,
    content:[
        "你的老婆是谁？",
        new fillBlank(),
    ]};
  return newQuestion;
}


export function defaultTestMixed(){
  let newQuestion = <question> { id: 0,
    content: [
      "你的老婆是谁？",
      new multiChoice({1:"两仪式", 
                      2:"两仪式 ❤", 
                      3:"两仪式 ❤❤", 
                      4:"两仪式 ❤❤❤"}),
      new unorderedSequenceChoice({1:"两仪式", 
                      2:"两仪式 ❤", 
                      3:"两仪式 ❤❤", 
                      4:"两仪式 ❤❤❤"}),
      new fillBlank(),
    ]
  }
  return newQuestion;
}


// hide correctAnswer of answerContainer when previewing question
export function maskObjQuestionAns(q: question) {
    q.content.forEach(
        (value)=>{
            if (typeof value === 'string')return value;
            if (value.type === objectiveQuestionType[objectiveQuestionType.Multi])
            {
                const newValue:objectiveAnswerKeyType = typeof (value as multiChoice).correctAnswer === 'string' ? '' : -1;
                (value as multiChoice).correctAnswer = newValue;
            }
            else if (value.type === objectiveQuestionType[objectiveQuestionType.FillBlank])
            {
                const newValue:objectiveAnswerKeyType = '';
                (value as fillBlank).correctAnswer = newValue;
            }
            // else if (value.type === )
        }
    )
    
}

export interface questionBank {
    id: string;
    title: string;
    content: question[] // question1,question2,...
}

export const defaultTestQuestionBank=(()=>  ({
        id: "0",
        title: "TestBank",
        content: [defaultTestMultiChoice(), defaultTestUnorderedSequenceChoice(), defaultTestFillBlank(), defaultTestMixed()]
    } as questionBank));

export function updateQuestionBank(questionBank1:questionBank, qbid:number,content_in:question[]){
    
}

export function updateQuestion(question1:question,qid:number){}

export interface userType {
  id: string;
  questionBanks: questionBank[];
}

export interface answerBank {
  uid: string; 
  qid: string;
  content: answer[];
}

export function initAnswerBank(uid: string, qbank: questionBank) {
  let newAnswerBank = {uid: uid, qid: qbank.id, content: []} as answerBank;
  for (let idx = 0; idx < qbank.content.length; idx++) {
    newAnswerBank.content[idx] = {id:qbank.content[idx].id, content:[]};
  }
  return newAnswerBank;
}