// Todo: add reactions to comments

import { Person } from 'types/person';

export interface Comment {
  id: string;
  index: number;
  taskId: string;
  commenter: Person;
  headerCommentId: string | null;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface InputComment {
  commenterId: string;
  headerCommentId: string | null;
  content: string;
  taskId: string;
}
