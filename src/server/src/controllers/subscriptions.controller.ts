// Todo: Add ConsoleLogs||ConsoleDebug and ConsoleErrors to each controller endpoint

import { Router } from 'express';
import { Request, Response } from 'express';
import { SubscriptionService } from 'services/subscriptions.services';

import { castSubscription } from 'cast';
import { createErrorResponse, affixItemNameToSubscription } from 'utils';

const subscriptionsController = (router: Router): void => {
  const subscriptionsService = new SubscriptionService();

  router.get('/subscriptions/:id', async function (
    req: Request,
    res: Response
  ) {
    try {
      const subscriptionEntities = await subscriptionsService.getSubscriptionsByUserId(
        req.params.id
      );

      const serverSubscriptions = await Promise.all(
        subscriptionEntities.map(async subscriptionEntity => {
          return await affixItemNameToSubscription(subscriptionEntity);
        })
      );

      const clientSubscriptions = serverSubscriptions.map(
        serverSubscription => {
          return castSubscription(serverSubscription);
        }
      );

      res.send(clientSubscriptions);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });
};

export default subscriptionsController;
