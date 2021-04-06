// Todo: Add ConsoleLogs||ConsoleDebug and ConsoleErrors to each controller endpoint

import { Router } from 'express';
import { CommentsService } from 'services/comments.services';
import { Request, Response } from 'express';
import { createErrorResponse } from 'utils';
import { castPersonedComment, castPersonComment, castUpdateItem } from 'cast';

import { IoRequest } from 'utils';
import { SocketMessages } from '../../../types/socket';

import { UpdateItemServices } from 'services/updateItems.services';
import { UpdateItemTypes, UpdateItemActions } from '../../../types/updateItem';

const commentsController = (router: Router): void => {
  const commentsService = new CommentsService();

  router.post('/comments', async function (
    req: Request & { io: any; userId: string },
    res: Response
  ) {
    try {
      const personedComment = await commentsService.createComment(req.body);

      const response = {
        userId: req.userId,
        comment: castPersonedComment(personedComment),
      };

      req.io.emit(SocketMessages.COMMENTS, response);

      const updateItemServices = new UpdateItemServices();

      const newUpdateItem = await updateItemServices.addUpdateItem(
        UpdateItemTypes.COMMENT,
        personedComment.id,
        UpdateItemActions.CREATE
      );

      const updateItemResponse = {
        updateItem: castUpdateItem(newUpdateItem),
        userId: req.userId,
      };

      req.io.emit(SocketMessages.UPDATE_ITEMS, updateItemResponse);

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
      const personedComments = await commentsService.getCommentsByTaskId(
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
      const comment = await commentsService.getCommentById(req.params.id);
      return res.send(castPersonedComment(comment));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.delete('/comments/:id', async function (req: Request, res: Response) {
    try {
      await commentsService.removeComment(req.params.id);
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
      const fixedComment = await commentsService.modifyComment(
        req.params.id,
        updatedComment
      );
      const response = {
        comment: castPersonedComment(castPersonComment(fixedComment)),
        userId: req.userId,
      };
      req.io.emit('comments', response);

      const updateItemServices = new UpdateItemServices();
      const newUpdateItem = await updateItemServices.addUpdateItem(
        UpdateItemTypes.COMMENT,
        fixedComment.id,
        UpdateItemActions.UPDATE
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
