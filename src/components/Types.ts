// NOTICE: record interfaces here
export enum interfaces{
    EmptyInterface,
    ExampleCounter,
    StatsInterface,
    QuestionEditInterface,
    QuestionAnswerInterface,
    MainInterface,
  }


// 题目
// 选择题部件
export enum objectiveQuestionType {
    Multi = "multi",                     // 选择题
    UnorderedSequence = "unordered_seq", // 多选题
    
}
type objectiveAnswerKeyType = (number | string)

export interface objectiveAnswerContainer {
    readonly id: string,
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
    correctAnswer: objectiveAnswerKeyType = '';
    
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
  export class fillBlank implements objectiveAnswerContainer{
    readonly id = getuuid();
    readonly type = objectiveQuestionType[objectiveQuestionType.FillBlank];
    correctAnswer: string = '';
    
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

export function defaultTestObjQuestion(id: number = 0) {
    let newQuestion = <question>{id: id, content:[
                "你的老婆是谁？",
                {
                    id: id, 
                    type: objectiveQuestionType.Multi,
                    choice: ["两仪式", 
                             "两仪式 ❤", 
                             "两仪式 ❤❤", 
                             "两仪式 ❤❤❤"],
                    correctAnswer: 3 
            },
            ]};
    return newQuestion;
}


export function maskObjQuestionAns(q: question) {
    if (q.content[1] instanceof objectiveAnswerContainer ){
        q.content[1].correctAnswer = -1;
        console.log("mask correctAnswer of objectiveAnswerContainer");
    } else if (q.content[1] instanceof subjectiveAnswerContainer){
        q.content[1].correctAnswer = "";
        console.log("mask correctAnswer of subjectiveAnswerContainer");
    }
}

export interface questionBank {
    id: number;
    title: string;
    content: question[] // question1,question2,...

}

export function defaultTestQuestionBank() {
    let newQuestionBank = <questionBank>{
        id: 0,
        title: "TestBank",
        content: [defaultTestObjQuestion(0), defaultTestObjQuestion(1), defaultTestObjQuestion(2)]
    }
    return newQuestionBank
}

export function updateQuestionBank(questionBank1:questionBank, qbid:number,content_in:question[]){
    
}

export function updateQuestion(question1:question,qid:number){}
export interface userType {
    id: string;
    questionBanks: questionBank[];
}