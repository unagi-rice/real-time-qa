import { parseStringStyle } from '@vue/shared'
import {question,answer, answerContainer, objectiveQuestionType, subjectiveQuestionType, unorderedSequenceChoice, objectiveAnswerContainer, subjectiveAnswerContainer} from '../Types'
import {multiChoice}from '../Types'
import { MultiNodeID,UnorderedSequenceNodeID,FillBlankNodeID,FreeResponseNodeID } from './CustomNode'
export function Markdown2QuestionAnswer(markdownString:string,qid?:string,aid?:string){
  /**
   * convert a answer node in markdown to object
   * @param str markdown
   * @returns {answerContainer,corresponding correct answer}
   */
  const basicRegex = /::(?<name>[a-zA-Z]+)\{identity="(?<identity>[^"]*)"[ \t]+type="(?<type>[^"]*)".*\}/g
  const MarkdownNode2AnswerContainer:(str:string)=>(string|{container:answerContainer,answerPart?:(string | number | number[])}) = (str:string)=>{
    const MultiRegex = RegExp(`::${MultiNodeID}{identity="(?<identity>[^"]*)" type="${objectiveQuestionType[objectiveQuestionType.Multi]}"[ \t]*choice="(?<choice>[^"]*)"[ \t]*correctAnswer="(?<correctAnswer>[^"]*)"\}`,'g')
    const UnorderedSequenceRegex = RegExp(`::${UnorderedSequenceNodeID}{identity="(?<identity>[^"]*)" type="${objectiveQuestionType[objectiveQuestionType.UnorderedSequence]}"[ \t]*choice="(?<choice>[^"]*)"[ \t]*correctAnswer="(?<correctAnswer>[^"]*)"\}`,'g')
    const FillBlankRegex = RegExp(`::${FillBlankNodeID}{identity="(?<identity>[^"]*)" type="${objectiveQuestionType[objectiveQuestionType.FillBlank]}"[ \t]*correctAnswer="(?<correctAnswer>[^"]*)"\}`,'g')
    const FreeResponseRegex = RegExp(`::${FreeResponseNodeID}{identity="(?<identity>[^"]*)"[ \t]*type="${subjectiveQuestionType.FreeResponse}"\}`,'g')
    const matchGroup = basicRegex.exec(str) as RegExpExecArray
    const identity = matchGroup[1];
    const nodeType = matchGroup[2];
    if(nodeType === objectiveQuestionType[objectiveQuestionType.Multi]){
      const matchGroup1 = MultiRegex.exec(str) as RegExpExecArray
      return {
        container:{
          id:matchGroup1[1],
          type:nodeType,
          choice:JSON.parse(matchGroup1[2]),
        },
        answerPart: matchGroup1[3]
      }
    }
    else if(nodeType === objectiveQuestionType[objectiveQuestionType.UnorderedSequence]){
      const matchGroup1 = UnorderedSequenceRegex.exec(str) as RegExpExecArray
      return {
        container:{
          id:matchGroup1[1],
          type:nodeType,
          choice:JSON.parse(matchGroup1[2]),
        },
        answerPart: JSON.parse(matchGroup1[3])
      }
    }
    else if(nodeType === objectiveQuestionType[objectiveQuestionType.FillBlank]){
      const matchGroup1 = FillBlankRegex.exec(str) as RegExpExecArray
      return {
        container:{
          id:matchGroup1[1],
          type:nodeType,
        },
        answerPart: matchGroup1[2]
      }
    }
    else if(nodeType === subjectiveQuestionType.FreeResponse){
      const matchGroup1 = FillBlankRegex.exec(str) as RegExpExecArray
      return {
        container:{
          id:matchGroup1[1],
          type:nodeType,
        }
      }
    }
    return str;
  }


  let resultQuestionContent :question["content"] = [];
  let resultAnswerContent :answer["content"] = [];
  let markdownString1 = markdownString;
  let match = basicRegex.exec(markdownString1);
  // case 1: matched, 
  while(match !== null)
  {
    const currOccurrence = match[0];
    let beforeOccurrence = markdownString1.substring(0,match.index)
    markdownString1 = markdownString1.substring(match.index + currOccurrence.length)
    let parsedObject = MarkdownNode2AnswerContainer(currOccurrence);
    if (typeof parsedObject === 'string') {
      resultQuestionContent.push(beforeOccurrence+parsedObject)
    }
    else {
      if (beforeOccurrence !== "")resultQuestionContent.push(beforeOccurrence);

      resultQuestionContent.push(parsedObject.container);
    }
    
    match = basicRegex.exec(markdownString1)
  }
  if(markdownString1 !== '')resultQuestionContent.push(markdownString1)
  let questionPart:question = {id:qid ?? '',content:resultQuestionContent};
  let answerPart:answer = {id:aid ?? '',content:resultAnswerContent};
  // match first qa
  
  return {
    question:questionPart,
    answer:answerPart,
  }
}

/**
 * convert question-answer pair to markdown string
 * @param question_in 
 * @param answer_in 
 * @returns markdown representing content of question and answer combined, does not preserve id of question and answer
 */
export function questionAnswer2Markdown(question_in:question,answer_in:answer):string
{
  let resultMarkdown = '';
  for(let content_i = 0; content_i < question_in.content.length;content_i += 1)
  {
    if (typeof question_in.content[content_i] === 'string')
    {
      resultMarkdown += question_in.content[content_i]
      continue
    }
    let currPart = question_in.content[content_i];
    let currAnswer = answer_in.content[content_i];
    if ((currPart as answerContainer).type === objectiveQuestionType[objectiveQuestionType.Multi])
    {
      resultMarkdown += ` ::${MultiNodeID}{identity="${(currPart as answerContainer).id}" type="${objectiveQuestionType[objectiveQuestionType.Multi]}" choice="${JSON.stringify((currPart as multiChoice).choice)}" correctAnswer="${currAnswer as (string | number)}"}`
    }
    else if ((currPart as answerContainer).type === objectiveQuestionType[objectiveQuestionType.UnorderedSequence])
    {
      resultMarkdown += ` ::${UnorderedSequenceNodeID}{identity="${(currPart as answerContainer).id}" type="${objectiveQuestionType[objectiveQuestionType.UnorderedSequence]}" choice="${JSON.stringify((currPart as unorderedSequenceChoice).choice)}" correctAnswer="${JSON.stringify(currAnswer)}"}`
      
    }
    else if ((currPart as answerContainer).type === objectiveQuestionType[objectiveQuestionType.FillBlank])
    {
      resultMarkdown += ` ::${UnorderedSequenceNodeID}{identity="${(currPart as answerContainer).id}" type="${objectiveQuestionType[objectiveQuestionType.FillBlank]}" correctAnswer="${currAnswer as string}"}`
    }
    else if ((currPart as answerContainer).type === subjectiveQuestionType.FreeResponse)
    {
      resultMarkdown += ` ::${FreeResponseNodeID}{identity="${(currPart as answerContainer).id}" type="${subjectiveQuestionType.FreeResponse}"}`
    }
  }
  return resultMarkdown;
}