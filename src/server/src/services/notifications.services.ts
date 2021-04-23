import { getConnection, Repository } from 'typeorm';
import { NotificationEntity } from 'entity/Notification';
import { SubscriptionEntity } from 'entity/Subscription';

export class NotificationService {
  notificationRepository: Repository<NotificationEntity>;

  constructor() {
    this.notificationRepository = getConnection().getRepository(
      NotificationEntity
    );
  }

  async createNotification(
    subscription: SubscriptionEntity,
    update_item_id: string
  ): Promise<NotificationEntity> {
    const newNotification = this.notificationRepository.create({
      user_id: subscription.subscriber_id,
      update_item_id,
      subscription_id: subscription.id,
    });

    const repoNotification = await this.notificationRepository.save(
      newNotification
    );

    return repoNotification;
  }
}
