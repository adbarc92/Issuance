// Todo: add reactions to comments

import { Person } from 'types/person';

// Server-side property naming, except with a person
export interface personedComment {
  id: string;
  index: number;
  task_id: string;
  commenter: Person;
  header_comment_id: string | null;
  content: string;
  created_at: Date;
  updated_at: Date;
}

// How the comment looks on the client
export interface ClientComment {
  id: string;
  index: number;
  taskId: string;
  commenter: Person; // Converts to the ID in DB
  headerCommentId: string | null;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// How a comment looks on the server
export interface ServerComment {
  id: string;
  index: number;
  taskId: string;
  commenterId: string;
  headerCommentId: string | null;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Information required to create a new comment
export interface NewComment {
  commenterId: string;
  headerCommentId: string | null;
  content: string;
  taskId: string;
}
