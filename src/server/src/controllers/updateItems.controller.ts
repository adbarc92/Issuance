// Todo: Add ConsoleLogs||ConsoleDebug and ConsoleErrors to each controller endpoint

import { Router } from 'express';
import { Request, Response } from 'express';

import { createErrorResponse } from 'utils';
import { UpdateItemService } from 'services/updateItems.services';

const notificationsController = (router: Router): void => {
  const updateItemService = new UpdateItemService();

  router.get('/notifications', async function (req: Request, res: Response) {
    try {
      const notifications = await updateItemService.getUpdateItems();
      return res.send(notifications);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });
};

export default notificationsController;
