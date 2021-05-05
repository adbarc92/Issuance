// Todo: Add ConsoleLogs||ConsoleDebug and ConsoleErrors to each controller endpoint

import { Router } from 'express';
import { CommentService } from 'services/comments.services';
import { Request, Response } from 'express';
import { createErrorResponse, affixUpdateItemToNotification } from 'utils';
import { castPersonedComment, castUpdateItem, castNotification } from 'cast';

import { UpdateItemService } from 'services/updateItems.services';
import { UpdateItemTypes, UpdateItemActions } from '../../../types/updateItem';

import { TaskService } from 'services/tasks.services';
import { SubscriptionService } from 'services/subscriptions.services';
import { NotificationService } from 'services/notifications.services';

import { SocketMessages } from '../../../types/socket';
import { SocketEventType } from '../../../types/subscription';

import {
  createSocketEventName,
  affixPersonToComment,
  IoRequest,
  logThenEmit,
} from '../utils';
import { UserService } from 'services/users.services';

const commentsController = (router: Router): void => {
  const commentService = new CommentService();

  router.post('/comments', async function (
    req: Request & { io: any; userId: string },
    res: Response
  ) {
    try {
      const updateItemServices = new UpdateItemService();
      const subscriptionService = new SubscriptionService();
      const taskService = new TaskService();
      const notificationService = new NotificationService();
      const userService = new UserService();

      const personedComment = await commentService.createComment(req.body);

      const clientComment = castPersonedComment(personedComment);

      const socketResponse = {
        userId: req.userId,
        comment: clientComment,
      };

      // req.io.emit(SocketMessages.COMMENTS, socketResponse);
      logThenEmit(req, SocketMessages.COMMENTS, socketResponse);

      const newUpdateItem = await updateItemServices.addUpdateItem(
        UpdateItemTypes.COMMENT,
        personedComment.id,
        UpdateItemActions.CREATE,
        req.userId
      );

      const assignedPerson = await taskService.getTaskAssigneeById(
        personedComment.task_id
      );

      const assignedUser = await userService.getUserByPersonId(
        assignedPerson.id
      );

      if (assignedUser) {
        const assigneeSubscription = await subscriptionService.createSubscription(
          personedComment.task_id,
          assignedUser.id,
          UpdateItemTypes.COMMENT
        );

        // Todo: undo redundant subscription emission
        const assigneeSocketEventName = createSocketEventName(
          SocketEventType.SUBSCRIPTION,
          assigneeSubscription.subscriber_id
        );
        // req.io.emit(assigneeSocketEventName, assigneeSubscription);
        logThenEmit(req, assigneeSocketEventName, assigneeSubscription);
      }

      const commenterSubscription = await subscriptionService.createSubscription(
        personedComment.task_id,
        req.userId,
        UpdateItemTypes.COMMENT
      );

      const commenterSocketEventName = createSocketEventName(
        SocketEventType.SUBSCRIPTION,
        commenterSubscription.subscriber_id
      );

      // req.io.emit(commenterSocketEventName, commenterSubscription);
      logThenEmit(req, commenterSocketEventName, commenterSubscription);

      const subscriptions = await subscriptionService.getSubscriptionsByItemId(
        personedComment.task_id
      );

      // Todo: refactor to separate function?
      for (const subscription of subscriptions) {
        if (newUpdateItem.user_id !== subscription.subscriber_id) {
          const newNotification = await notificationService.createNotification(
            subscription,
            newUpdateItem.id
          );

          const fixedNotification = await affixUpdateItemToNotification(
            newNotification
          );

          const notificationSocketEvent = createSocketEventName(
            SocketEventType.NOTIFICATION,
            subscription.subscribed_item_id
          );
          console.log('notificationSocketEvent:', notificationSocketEvent);

          const clientNotification = await castNotification(fixedNotification);

          console.log('clientNotification:', clientNotification);

          // req.io.emit(notificationSocketEvent, newNotification);
          logThenEmit(req, notificationSocketEvent, clientNotification);
        }
      }

      return res.send(clientComment);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.get('/comments/task/:id', async function (
    req: Request,
    res: Response
  ) {
    try {
      const personedComments = await commentService.getCommentsByTaskId(
        req.params.id
      );
      return res.send(
        personedComments.map(comment => castPersonedComment(comment))
      );
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.get('/comments/:id', async function (req: Request, res: Response) {
    try {
      const comment = await commentService.getCommentById(req.params.id);
      return res.send(castPersonedComment(comment));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.delete('/comments/:id', async function (req: Request, res: Response) {
    try {
      await commentService.removeComment(req.params.id);
      res.send(JSON.stringify({}));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.put('/comments/:id', async function (
    req: Request & { io: any; userId: string },
    res: Response
  ) {
    try {
      const updatedComment = req.body;
      const fixedComment = await commentService.modifyComment(
        req.params.id,
        updatedComment
      );
      const commentEntityWithPerson = await affixPersonToComment(fixedComment);
      const response = {
        comment: commentEntityWithPerson,
        userId: req.userId,
      };
      // req.io.emit(SocketMessages.COMMENTS, response);
      logThenEmit(req, SocketMessages.COMMENTS, response);

      const updateItemServices = new UpdateItemService();
      const newUpdateItem = await updateItemServices.addUpdateItem(
        UpdateItemTypes.COMMENT,
        fixedComment.id,
        UpdateItemActions.UPDATE,
        req.userId
      );

      const updateItemResponse = {
        updateItem: castUpdateItem(newUpdateItem),
        userId: req.userId,
      };

      // req.io.emit(SocketMessages.UPDATE_ITEMS, updateItemResponse);
      logThenEmit(req, SocketMessages.UPDATE_ITEMS, updateItemResponse);

      res.send(response);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });
};

export default commentsController;
