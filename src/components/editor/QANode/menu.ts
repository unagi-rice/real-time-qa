import { Cmd } from '@milkdown/core';
import {} from '@milkdown/plugin-menu'
import { setBlockType } from 'prosemirror-commands';
import { TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';


export const QANodeMenu = {
  type: 'select',
  text: '插入',
  options: [
    { id: '1', text: '单选题' },
    { id: '2', text: '填空题' },
    { id: '3', text: '主观题' },
    // { id: '0', text: 'Plain Text' },
  ],
  disabled: (view:EditorView) => {
    const { state } = view;
    const nodeqa = state.schema.nodes['nodeqa']; // TODO: does nodeqa exists in editorState.schema.nodes
    if (!nodeqa) return true;
    const insertQANode:Cmd<number> = (dest_type: number) => setBlockType(nodeqa, { dest_type })(state);
    return (
      !(view.state.selection instanceof TextSelection) ||
      !(insertQANode(1) || insertQANode(2) || insertQANode(3))
    );
  },
  onSelect: (id) => (Number(id) ? ['InsertSmth', Number(id)]), // TODO: command ['commandName', argument]
},