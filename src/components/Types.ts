// NOTICE: record interfaces here
export enum interfaces{
    EmptyInterface,
    ExampleCounter,
    StatsInterface,
    QuestionEditInterface,
    QuestionAnswerInterface,
  }


// 题目
// 选择题部件
export enum objectiveQuestionType {
    Multi = "multi",                     // 选择题
    UnorderedSequence = "unordered_seq", // 多选题
    // OrderedSequence="ordered_seq"
    
}
export class objectiveAnswerContainer<choiceType = string> {
    id: number;
    type: string;       // 
    choices: {[key:string]: choiceType}; // [a,b,c,d] 
    correctAnswer: number | number[]; // matching id-type
    // public markdown(){}

    
    constructor(init:{id:number,type:string,choice:{key:choiceType},correctAnswer: number | number[]})
    {
        [this.id,this.type,this.choices,this.correctAnswer] = [init.id,init.type,init.choice,init.correctAnswer];

    }

}


export enum subjectiveQuestionType {
    FreeResponse= 'free_res',      // 文字主观题
    // GraphicResponse= 'graph_res'// 绘图主观题
}
// 主观题部件
export class subjectiveAnswerContainer{
    id:number;
    type:string;
    correctAnswer:string | undefined;

    constructor(init:{id:number, type:string, correctAnswer: string | undefined}){
        this.id = init.id;
        this.type = init.type;
        this.correctAnswer = init.correctAnswer;
    }
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