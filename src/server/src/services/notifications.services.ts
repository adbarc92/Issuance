import { getConnection, Repository } from 'typeorm';
import { NotificationEntity } from 'entity/Notification';
import { SubscriptionEntity } from 'entity/Subscription';
import { ClientNotification } from '../../../types/notification';
import { snakeCasify } from 'utils';

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

  async getNotificationsByUserId(
    user_id: string
  ): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find({ user_id });
  }

  async getNotificationById(id: string): Promise<NotificationEntity> {
    return await this.notificationRepository.findOne({ id });
  }

  async modifyNotification(
    updatedNotification: ClientNotification
  ): Promise<NotificationEntity> {
    const oldNotification = await this.getNotificationById(
      updatedNotification.id
    );

    console.log('oldNotification:', oldNotification);

    const snakeNotification = snakeCasify(updatedNotification);

    const { viewed } = snakeNotification;

    const fixedNotification = this.notificationRepository.merge(
      oldNotification,
      {
        viewed,
      }
    );

    return await this.notificationRepository.save(fixedNotification);
  }

  async modifyNotifications(
    updatedNotifications: ClientNotification[]
  ): Promise<NotificationEntity[]> {
    return await Promise.all(
      updatedNotifications.map(async updatedNotifications => {
        return await this.modifyNotification(updatedNotifications);
      })
    );
  }
}
