import { getConnection, Repository } from 'typeorm';
import { Notification as NotificationEntity } from 'entity/Notification';

export class NotificationService {
  notificationRepository: Repository<NotificationEntity>;

  constructor() {
    this.notificationRepository = getConnection().getRepository(
      NotificationEntity
    );
  }

  async createNotification(
    user_id: string,
    update_item_id: string
  ): Promise<NotificationEntity> {
    const newNotification = this.notificationRepository.create({
      user_id,
      update_item_id,
    });

    const repoNotification = await this.notificationRepository.save(
      newNotification
    );

    return repoNotification;
  }
}
