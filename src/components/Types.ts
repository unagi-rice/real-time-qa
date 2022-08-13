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
    choice: {key: choiceType}, // [a,b,c,d]
    correctAnswer: number | number[], // matching id-type
    test(chosen:choiceType):boolean;
}


export enum subjectiveQuestionType {
    FreeResponse= 'free_res',      // 文字主观题
    // GraphicResponse= 'graph_res'// 绘图主观题
}
// 主观题部件
export type subjectiveAnswerContainer = {
    id:number,
    type:string,
    correct_answer:string | undefined
}
export const  questionType = {...objectiveQuestionType , ...subjectiveQuestionType};
export type questionType = typeof questionType;
export type answerContainer = objectiveAnswerContainer | subjectiveAnswerContainer;
export interface question {
    id: number;
    content: (string | objectiveAnswerContainer | subjectiveAnswerContainer)[];
    
}
export interface questionBank {
    id: number;
    title: string;
    content: question[] // question1,question2,...
}

export function updateQuestionBank(questionBank1:questionBank,qbid:number,content_in:question[]){
    
}
export function updateQuestion(question1:question,qid:number){}
export interface userType {
    id: string;
    questionBanks: questionBank[];
}