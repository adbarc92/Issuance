import { getConnection, Repository } from 'typeorm';
import { Subscription as SubscriptionEntity } from 'entity/Subscription';

import { UpdateItemTypes } from '../../../types/updateItem';

export class SubscriptionService {
  subscriptionRepository: Repository<SubscriptionEntity>;

  constructor() {
    this.subscriptionRepository = getConnection().getRepository(
      SubscriptionEntity
    );
  }

  async createSubscription(
    subscribed_item_id: string,
    subscriber_id: string,
    subscription_type: UpdateItemTypes
  ): Promise<SubscriptionEntity> {
    try {
      const existingSubscription = this.subscriptionRepository.findOne({
        subscribed_item_id,
        subscriber_id,
        subscription_type,
      });

      return existingSubscription;
    } catch (e) {
      console.log(e);
      const newSubscription = this.subscriptionRepository.create({
        subscribed_item_id,
        subscriber_id,
        subscription_type,
      });

      const repoSubscription = await this.subscriptionRepository.save(
        newSubscription
      );

      return repoSubscription;
    }
  }

  // Todo: bug-test this
  async getSubscriptionsByItemId(
    subscribed_item_id: string
  ): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository
      .createQueryBuilder('task')
      .select('*')
      .where('subscribed_item_id = :subscribed_item_id', { subscribed_item_id })
      .execute();
  }
}
