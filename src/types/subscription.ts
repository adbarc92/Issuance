import { UpdateItemTypes } from './updateItem';

export interface ClientSubscription {
  id: string;
  subscribedItemId: string;
  subscriberId: string;
  subscribedItemType: UpdateItemTypes;
  subscribedItemName: string;
  createdAt: Date | string;
}

export interface ServerSubscription {
  id: string;
  subscribed_item_id: string;
  subscriber_id: string;
  subscribed_item_type: UpdateItemTypes;
  subscribed_item_name: string;
  created_at: Date | string;
}

export enum SocketEventType {
  SUBSCRIPTION = 'SUBSCRIPTION_',
  NOTIFICATION = 'NOTIFICATION_',
}
