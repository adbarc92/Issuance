// Todo: Add ConsoleLogs||ConsoleDebug and ConsoleErrors to each controller endpoint

import { Router } from 'express';
import { CommentService } from 'services/comments.services';
import { Request, Response } from 'express';
import { createErrorResponse } from 'utils';
import { castPersonedComment, castPersonComment, castUpdateItem } from 'cast';

import { IoRequest } from 'utils';
import { SocketMessages } from '../../../types/socket';

import { UpdateItemService } from 'services/updateItems.services';
import { UpdateItemTypes, UpdateItemActions } from '../../../types/updateItem';

import { TaskService } from 'services/tasks.services';
import { SubscriptionService } from 'services/subscriptions.services';

const commentsController = (router: Router): void => {
  const commentService = new CommentService();

  router.post('/comments', async function (
    req: Request & { io: any; userId: string },
    res: Response
  ) {
    try {
      const personedComment = await commentService.createComment(req.body);

      const response = {
        userId: req.userId,
        comment: castPersonedComment(personedComment),
      };

      req.io.emit(SocketMessages.COMMENTS, response);

      const updateItemServices = new UpdateItemService();

      const newUpdateItem = await updateItemServices.addUpdateItem(
        UpdateItemTypes.COMMENT,
        personedComment.id,
        UpdateItemActions.CREATE,
        req.userId
      );

      const subscriptionService = new SubscriptionService();

      const commmenterSubscription = await subscriptionService.createSubscription(
        personedComment.task_id,
        req.userId,
        UpdateItemTypes.COMMENT
      );

      console.log('commmenterSubscription:', commmenterSubscription);

      const taskService = new TaskService();

      const assignedPerson = await taskService.getTaskAssigneeById(
        personedComment.task_id
      );

      const newSubscription = await subscriptionService.createSubscription(
        personedComment.task_id,
        assignedPerson.id,
        UpdateItemTypes.COMMENT
      );

      // const userService = new UserService();

      // const assignedUser = await userService.getUserByPersonId(
      //   assignedPerson.id
      // );

      // if (assignedUser.id !== req.userId) {
      //   const notificationService = new NotificationService();

      //   const newNotification = notificationService.createNotification(
      //     assignedUser.id,
      //     newUpdateItem.id
      //   );

      //   console.log('newNotification:', newNotification);
      // }

      // const updateItemResponse = {
      //   updateItem: castUpdateItem(newUpdateItem),
      //   userId: req.userId,
      // };

      // req.io.emit(SocketMessages.UPDATE_ITEMS, updateItemResponse);

      console.log('comment post response:', response);
      return res.send(response.comment);
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
      const response = {
        comment: castPersonedComment(castPersonComment(fixedComment)),
        userId: req.userId,
      };
      req.io.emit('comments', response);

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

      req.io.emit(SocketMessages.UPDATE_ITEMS, updateItemResponse);

      res.send(response);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });
};

export default commentsController;
