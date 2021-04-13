// Todo: Add ConsoleLogs||ConsoleDebug and ConsoleErrors to each controller endpoint

import { Router } from 'express';
import { Request, Response } from 'express';
import { SubscriptionService } from 'services/subscriptions.services';

import { castSubscription } from 'cast';
import { createErrorResponse } from 'utils';

const subscriptionsController = (router: Router): void => {
  const subscriptionsService = new SubscriptionService();

  router.get('/subscriptions/:id', async function (
    req: Request,
    res: Response
  ) {
    try {
      const subscriptions = await subscriptionsService.getUserSubscriptions(
        req.params.id
      );
      const promisedSubscriptions = async () => {
        return Promise.all(
          subscriptions.map(subscription => castSubscription(subscription))
        );
      };
      return promisedSubscriptions().then(resolvedSubs => {
        res.send(resolvedSubs);
      });
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });
};

export default subscriptionsController;
