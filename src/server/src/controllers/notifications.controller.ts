import { Router, Request, Response } from 'express';
import { NotificationService } from 'services/notifications.services';
import { createErrorResponse, affixUpdateItemToNotification } from 'utils';
import { castNotification } from 'cast';
// import

const notificationsController = (router: Router): void => {
  const notificationService = new NotificationService();

  router.get(`/notifications/:userId`, async function (
    req: Request,
    res: Response
  ) {
    try {
      const notifications = await notificationService.getNotificationsByUserId(
        req.params.id
      );

      console.log('notifications:', notifications);

      const unviewedNotifications = notifications.filter(notification => {
        return notification.viewed === false;
      });

      console.log('unviewedNotifications:', unviewedNotifications);

      return unviewedNotifications;
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.put('/notifications', async function (req: Request, res: Response) {
    try {
      console.log('req.body:', req.body);

      const notifications = await notificationService.modifyNotifications(
        req.body
      );
      const serverNotifications = await Promise.all(
        notifications.map(async notification => {
          return await affixUpdateItemToNotification(notification);
        })
      );

      console.log('serverNotifications:', serverNotifications);

      const clientNotifications = serverNotifications.map(serverNotification =>
        castNotification(serverNotification)
      );

      console.log('clientNotifications:', clientNotifications);

      res.send(clientNotifications);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });
};

export default notificationsController;
