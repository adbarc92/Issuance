export enum UpdateItemTypes {
  COMMENT = 'Comment',
  PROJECT = 'Project',
  TASK = 'Task',
}

export enum UpdateItemActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface ClientUpdateItem {
  id: string;
  createdAt: Date | string;
  itemType: UpdateItemTypes;
  itemIds: string;
  actionType: UpdateItemActions;
}
