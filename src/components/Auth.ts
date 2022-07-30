/** Utilities to get and save role of current user */

import type { AppContext } from "@netless/window-manager";
export function getUid(context:AppContext|undefined):string|undefined
{
  return context?.getRoom()?.uid;
}

export interface AuthSnapshot{
  // store 
  teacher: [];
  student: [];
}

export function login(context:AppContext):boolean
{
  const room = context.getRoom();
  if(room === undefined)
  {
    console.log('Auth.ts: login failed');
    return false;
  }
  const uid = getUid(context);
  console.log('can write?',room.isWritable);
  console.log('Auth.ts:',uid,'login successfully');
  return room.isWritable;
}
export function makeAuthSnapshot(context:AppContext|undefined):AuthSnapshot
{
  let result:AuthSnapshot;
  let room = context?.getRoom();
  if(room)
  // for all members in this room,
  room.state.roomMembers.forEach((member)=>
  {
    const uid = member.memberId;
    // TODO:no api available to access other member's writability
    // if is writable, add into teacher
    // if is not writable, add into student

  });

}
  
  // can non writable user view modal and 
  // TODO: restoreAuthSnapshot

