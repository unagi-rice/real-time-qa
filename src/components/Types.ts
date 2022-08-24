import { v1 as getuuid } from 'uuid';
/** 全部界面 */
export enum interfaces{
    EmptyInterface,
    ExampleCounter,
    StatsInterface,
    IndividualStatsInterface,
    QuestionEditInterface,
    QuestionAnswerInterface,
    MainInterface,
  }
/**
生命循环：
0. 从导入的JSON字符串所解析成的物件（泛指所有JS物件）生成题Markdown（每个问题的节点包括答案）
1. 题Markdown编辑完成后，生成对应的问题、答案JSON物件
2. （如需要）发布问题（库）物件给学生，开始答题环节，结束答题环节时学生把答案（库）发回
3. 答案库、问题库序列化成JSON字符串储存
 */

/****** 题目类型定义 *******/
// 客观题
export enum objectiveQuestionType {
  Multi,           // 选择题
  UnorderedSequence, // 多选题
  FillBlank, // 填空题
}
export type objectiveAnswerKeyType = (number | string)

export interface objectiveAnswerContainer {
    readonly id: string
    readonly type: string,     // 
    choice?: {[key :objectiveAnswerKeyType]:string}, // [a:'content1',b:'content2',c:'content3',d:'content4']
}
export class multiChoice implements objectiveAnswerContainer{
  readonly id = getuuid();
  readonly type = objectiveQuestionType[objectiveQuestionType.Multi];
  choice:{[key :objectiveAnswerKeyType]:string} = {}
    
  constructor(choice:{[key:objectiveAnswerKeyType]:string}) {
    this.choice = choice;
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
  // set setCorrectAnswer(newAnswer: objectiveAnswerKeyType[]) {
  //   let flag = true;
  //   for (var opt in newAnswer) {
  //     if (this.choice[opt] === undefined) {
  //       flag = false;
  //     }
  //   }
  //   if (flag)
  //   {
  //     this.correctAnswer = newAnswer;
  //   }
  // }
  // test(chosen:objectiveAnswerKeyType[]) {
  //   for (var opt in chosen) {
  //     if (!this.correctAnswer.includes(opt)) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }
}


export class fillBlank implements objectiveAnswerContainer{
  readonly id = getuuid();
  readonly type = objectiveQuestionType[objectiveQuestionType.FillBlank];
}

// 主观题
export enum subjectiveQuestionType {
    FreeResponse= 'free_res',      // 文字主观题
}

export interface subjectiveAnswerContainer <contentType=string>{
  readonly id:string,
  readonly type:string,
  marking:(answer:contentType)=>boolean
}

export type answerContainer = objectiveAnswerContainer | subjectiveAnswerContainer;

export interface question {
  id: string;
  content: (string | objectiveAnswerContainer | subjectiveAnswerContainer)[];
}





// 问题库，又称“卷子”
export interface questionBank {
    id: string;
    title: string;
    content: question[] // question1,question2,...
}

/* 单题答案 */
export interface answer {
  id: string;
  content: {[key: number]: (string | number | number[])}// {对应question.content中出现答题点的索引:答题点的答案}
}

// 答案库，又称“答卷”
export interface answerBank {
  uid: string;
  qid: string;
  content: answer[];
}

// 答题环节数据
export interface QAStorage {
  pageid: number;
  questionBank: questionBank;
  answerBanks: { [key: string]: answerBank };
  tag: string;
  allowAnswer: boolean;// 控制是否在“正在答题”中
}

export function defaultTestMultiChoice() {
  return <question>
        { id: getuuid(),
          content:[
              "你的老婆是谁？",
              new multiChoice({1:"两仪式", 
                           2:"两仪式 ❤", 
                           3:"两仪式 ❤❤", 
                           4:"两仪式 ❤❤❤"}),
          ]};
}

export function defaultTestUnorderedSequenceChoice(){
return <question>{ id: getuuid(),
  content:[
      "你的老婆是谁？",
      new unorderedSequenceChoice({1:"两仪式", 
                   2:"两仪式 ❤", 
                   3:"两仪式 ❤❤", 
                   4:"两仪式 ❤❤❤"}),
  ]};
}

export function defaultTestFillBlank(){
return <question>{ id: getuuid(),
  content:[
      "你的老婆是谁？",
      new fillBlank(),
  ]};
}


export function defaultTestMixed(){
return <question> { id: getuuid(),
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
}

export const defaultTestQuestionBank=(()=>  ({
        id: getuuid(),
        title: "TestBank",
        content: [defaultTestMultiChoice(), defaultTestUnorderedSequenceChoice(), defaultTestFillBlank(), defaultTestMixed()]
    } as questionBank));
export function initAnswerBank(uid: string, qbank: questionBank) {
  let newAnswerBank = {uid: uid, qid: qbank.id, content: []} as answerBank;
  for (let idx = 0; idx < qbank.content.length; idx++) {
    newAnswerBank.content[idx] = {id:qbank.content[idx].id, content:[]};
  }
  return newAnswerBank;
}
export function updateQuestionBank(questionBank1:questionBank, qbid:number,content_in:question[]){
    
}

export function updateQuestion(question1:question,qid:number){}


export const QuestionBankInit=(()=>  ({
  id: getuuid(),
  questionBanks: [defaultTestQuestionBank()]
}));



