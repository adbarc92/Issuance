import { getConnection, Repository } from 'typeorm';
import { UpdateItemEntity } from 'entity/UpdateItem';

import { UpdateItemTypes, UpdateItemActions } from '../../../types/updateItem';

export class UpdateItemService {
  updateItemRepository: Repository<UpdateItemEntity>;

  constructor() {
    this.updateItemRepository = getConnection().getRepository(UpdateItemEntity);
  }

  async getUpdateItems(quantity?: number): Promise<UpdateItemEntity[]> {
    return quantity
      ? await this.updateItemRepository.find({ take: quantity })
      : await this.updateItemRepository.find();
  }

  async addUpdateItem(
    item_type: UpdateItemTypes,
    item_id: string,
    action_type: UpdateItemActions,
    user_id: string
  ): Promise<UpdateItemEntity> {
    const newUpdateItem = this.updateItemRepository.create({
      item_type,
      item_id,
      action_type,
      user_id,
    });

    const repoUpdateItem = await this.updateItemRepository.save(newUpdateItem);

    return repoUpdateItem;
  }

  async getUpdateItemById(update_item_id: string): Promise<UpdateItemEntity> {
    return await this.updateItemRepository.findOne({
      id: update_item_id,
    });
  }
}
