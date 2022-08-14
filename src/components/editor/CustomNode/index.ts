/* Copyright 2021, Milkdown by Mirone. */

import { AtomList } from '@milkdown/utils';

import { QANode } from './node';

export * from './remark-qa';

export const qanode = AtomList.create([QANode()]);

export type { Options } from './node';
export { InsertQA } from './node';
