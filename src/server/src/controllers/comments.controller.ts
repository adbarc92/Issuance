import { Router } from 'express';
import { CommentsService } from 'services/comments.services';
import { Request, Response } from 'express';
import { createErrorResponse } from 'utils';
import { Comment as EComment } from 'entity/Comment';
import { castComment } from 'cast';

import { IoRequest } from 'utils';

const commentsController = (router: Router): void => {
  const commentsService = new CommentsService();

  router.post('/comments/task/:id', async function (
    req: Request,
    res: Response
  ) {
    try {
      const comments = await commentsService.createComment(req.body);
      return res.send(
        comments.map((comment): EComment => castComment(comment))
      );
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
      const comment = await commentsService.getCommentsByTaskId(req.params.id);
      return res.send(castComment(comment));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.get('/comments/:id', async function (req: Request, res: Response) {
    try {
      const comment = await commentsService.getCommentById(req.params.id);
      return res.send(castComment(comment));
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
        comment: castComment(fixedComment),
        userId: req.userId,
      };
      req.io.emit('comments', response);
      res.send(response);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });
};