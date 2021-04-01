import { getConnection, Repository } from 'typeorm';
import { UpdateItem } from 'entity/UpdateItem';

export class NotificationService {
  notificationRepository: Repository<UpdateItem>;

  constructor() {
    this.notificationRepository = getConnection().getRepository(UpdateItem);
  }

  async getNotifications(): Promise<UpdateItem[]> {
    return await this.notificationRepository.find();
  }
}
