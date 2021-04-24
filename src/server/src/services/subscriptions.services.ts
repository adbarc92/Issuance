import { getConnection, Repository } from 'typeorm';
import { SubscriptionEntity } from 'entity/Subscription';

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
    subscribed_item_type: UpdateItemTypes
  ): Promise<SubscriptionEntity> {
    const existingSubscription = await this.subscriptionRepository.findOne({
      subscribed_item_id,
      subscriber_id,
      subscribed_item_type,
    });

    if (existingSubscription) {
      console.log('Subscription exists.');
      return existingSubscription;
    } else {
      const newSubscription = this.subscriptionRepository.create({
        subscribed_item_id,
        subscriber_id,
        subscribed_item_type,
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
      .createQueryBuilder('subscription')
      .select('*')
      .where('subscribed_item_id = :subscribed_item_id', { subscribed_item_id })
      .execute();
  }

  async getSubscriptionsByUserId(
    subscriber_id: string
  ): Promise<SubscriptionEntity[]> {
    const subscriptions = await this.subscriptionRepository.find({
      subscriber_id,
    });
    console.log('subscriptions:', subscriptions);
    return subscriptions;
  }

  async getSubscriptionById(
    subscription_id: string
  ): Promise<SubscriptionEntity> {
    return await this.subscriptionRepository.findOne({
      id: subscription_id,
    });
  }
}
