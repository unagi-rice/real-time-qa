import { createCmdKey, type MilkdownPlugin, CommandsReady, commandsCtx, schemaCtx,type Cmd } from '@milkdown/core';
import { setBlockType } from 'prosemirror-commands';
import type { Command, EditorState, Transaction } from 'prosemirror-state';
import { h } from 'vue';
/**
 * @param questionTypeID type of question
 *        1: multiple choice
 *        2: fill in the blank
 *        3: free response
 */
export const InsertSmth = createCmdKey<number>();




// this plugin can register command into manager
export const QANodeCommandPlugin: MilkdownPlugin = () => async (ctx) => {
  // wait for command manager ready
  await ctx.wait(CommandsReady);
  const commandManager = ctx.get(commandsCtx);
  const schema = ctx.get(schemaCtx);
  
  /**
 * 
 * @param questionTypeID type of question to insert
 * @returns command decorator
 */
  function InsertSmthFunc(questionTypeID:number){
    // question_type:questionType = questionTypeID as questionType
    // TODO: 
    let qaType;
    if(questionTypeID === 1){
      // TODO: multitype
      qaType = schema.nodes.multiChoice;
    }
    else if (questionTypeID === 2){
      qaType = schema.nodes.fillBlank;
    }
    if (qaType)return setBlockType(qaType);
    return setBlockType(schema.nodes.text);
  }
  
  commandManager.create(InsertSmth, InsertSmthFunc as Cmd<number>);
};
// call command
// commandManager.call(InsertSmth); // turn to h1 by default
// commandManager.call(InsertSmth, 2); // turn to h2