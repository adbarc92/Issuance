// Todo: add reactions to comments

import { Person } from 'types/person';

export interface Comment {
  id: string;
  index: number;
  taskId: string;
  commenter: Person; // Converts to the ID in DB
  headerCommentId: string | null;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DComment {
  id: string;
  index: number;
  taskId: string;
  commenterId: string;
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
