// NOTICE: record interfaces here
export enum interfaces{
    EmptyInterface,
    ExampleCounter
  }


// 题目
// 选择题部件
export enum objectiveQuestionType {
    Multi = "multi",                     // 选择题
    UnorderedSequence = "unordered_seq", // 多选题
    // OrderedSequence="ordered_seq"
    
}
export interface objectiveAnswerContainer<choiceType = string> {
    id: number,
    type: string,       // 
    choice: [key: choiceType], // [a,b,c,d]
    correctAnswer: number | number[], // matching id-type
    get getType():string;
    set setCorrectAnswer(newAnswer:number | number[]);
    test(chosen:choiceType):boolean;
}
export type Choice = {
    id: number,
    content: string,
    binded_content: any
}
export enum subjectiveQuestionType {
    FreeResponse= 'free_res',      // 文字主观题
    // GraphicResponse= 'graph_res'// 绘图主观题
}
// 主观题部件
export type subjectiveAnswerContainer = {
    id:number,
    type:string,
    content:any
}
export const  questionType = {...objectiveQuestionType , ...subjectiveQuestionType};
export type questionType = typeof questionType;
export type answerContainer = objectiveAnswerContainer | subjectiveAnswerContainer;
export interface question {
    id: number;
    content: any;
    // example: content:["text1",component,"text2"]
    
}
export interface questionBank {
    id: number;
    title: string;
    content: question[] // question1,question2,...
}

