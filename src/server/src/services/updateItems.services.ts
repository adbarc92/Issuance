import { getConnection, Repository } from 'typeorm';
import {
  UpdateItem,
  UpdateItemTypes,
  UpdateItemActions,
} from 'entity/UpdateItem';

export class UpdateItemServices {
  updateItemRepository: Repository<UpdateItem>;

  constructor() {
    this.updateItemRepository = getConnection().getRepository(UpdateItem);
  }

  async getUpdateItems(quantity?: number): Promise<UpdateItem[]> {
    return quantity
      ? await this.updateItemRepository.find({ take: quantity })
      : await this.updateItemRepository.find();
  }

  async addUpdateItem(
    item_type: UpdateItemTypes,
    item_id: string,
    action: UpdateItemActions
  ): Promise<UpdateItem> {
    return this.updateItemRepository.create({ item_type, item_id });
  }
}
