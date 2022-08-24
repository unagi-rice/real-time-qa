/** Utilities to get and save role of current user */
import type { AppContext } from "@netless/window-manager";
export function getUid(context: AppContext | undefined): string | undefined {
  return context?.getRoom()?.uid;
}

export interface AuthSnapshot{
  // store 
  teacher: Array<string>;
  student: Array<string>;
}

export function login(context: AppContext): boolean {
  const room = context.getRoom();
  if (room === undefined) {
    console.log("Auth.ts: login failed");
    return false;
  }
  const uid = getUid(context);
  console.log("can write?", room.isWritable);
  console.log("Auth.ts:", uid, "login successfully");
  return room.isWritable;
}

/**
 * case 1: as the first writable member call this function, 
 *    caller's UID will be recorded as teacher and is able to access
 *    question editing features of this app
 * case 2: else, UID of the caller will be recorded as student,
 *    and can only make answering response when a QA session is published by teacher
 * @param context AppContext provided by root component of app
 * @returns true
 */
export function loginTeacher(context: AppContext): void {
  const uid = getUid(context) as string;
  const defaultState:AuthSnapshot = { teacher: [], student: [] };
  const storage = context.createStorage<AuthSnapshot>("TeacherStudent", defaultState);
  let tempState = structuredClone(storage.state);
  // storage.setState(defaultState); // uncomment this line to reset state of storage
  if (storage.state.teacher.length === 0) tempState.teacher.push(uid);
  else if(storage.state.teacher[0] !== uid && !storage.state.student.includes(uid)) 
    tempState.student.push(uid);
  storage.setState(tempState);
}

/**
 * check if current user is an autheticated teacher
 * @param context AppContext provided by root component of app
 * @returns 
 */
export function checkTeacher(context: AppContext): boolean {
  const uid = getUid(context);
  const storage = context.createStorage<AuthSnapshot>("TeacherStudent");
  console.log(JSON.stringify(storage.state));
  if(storage.state.teacher[0] === uid) return true;
  else return false;
}

/**
 * called when window is closed(onDestroy)
 * @param context AppContext provided by root component of app
 */
export function logoutTeacher(context: AppContext): void {
  const uid = getUid(context) as string;
  const isTeacher:boolean = checkTeacher(context);
  const storage = context.createStorage<AuthSnapshot>("TeacherStudent");
  let tempState = structuredClone(storage.state);
  if (storage.state.teacher.length === 0) throw new Error("room is already empty, logout failed");
  if(isTeacher)tempState.teacher.remove(uid);
  if(storage.state.teacher[0] !== uid && !storage.state.student.includes(uid)) 
    tempState.student.remove(uid);
  storage.setState(tempState);
}

export function resetAuth(context:AppContext){
  const defaultState:AuthSnapshot = { teacher: [], student: [] };

  const storage = context.createStorage<AuthSnapshot>("TeacherStudent",defaultState);
  storage.setState(defaultState); // uncomment this line to reset state of storage
  console.log(storage.state)
}
