import { UpdateItemTypes } from 'types/updateItem';

export interface ClientSubscription {
  id: string;
  subscribedItemId: string;
  subscribedItemType: UpdateItemTypes;
  subscribedItemName: string;
  subscriberId: string;
  createdAt: Date | string;
}
