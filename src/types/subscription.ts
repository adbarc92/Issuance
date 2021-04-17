import { UpdateItemTypes } from './updateItem';

export interface ClientSubscription {
  id: string;
  subscribedItemId: string;
  subscribedItemType: UpdateItemTypes;
  subscribedItemName: string;
  subscriberId: string;
  createdAt: Date | string;
}

export enum SocketEventType {
  SUBSCRIPTION = 'SUBSCRIPTION_',
  NOTIFICATION = 'NOTIFICATION_',
}
