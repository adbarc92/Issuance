import { Router } from 'express';
import { TaskService } from 'services/tasks.services';
import { Request, Response } from 'express';
import { castTask, castCommentedTask } from 'cast';
import { createErrorResponse } from 'utils';
import { ClientTask } from '../../../types/task';
import { SocketMessages } from '../../../types/socket';

import { IoRequest } from 'utils';

const tasksController = (router: Router): void => {
  const taskService = new TaskService();

  router.get('/tasks/:id', async function (req: Request, res: Response) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      const commentedTask = castCommentedTask(task);
      console.log('commentedTask:', commentedTask);
      return res.send(commentedTask);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.get('/tasks', async function (req: Request, res: Response) {
    try {
      // * Group by Status, Order by Row Index
      const tasks = await taskService.getTasks();
      return res.send(tasks.map(task => castTask(task)));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.get('/tasks/:id', async function (req: Request, res: Response) {
    try {
      const tasks = await taskService.getTasksByProjectId(req.params.id);
      return res.send(tasks.map(task => castTask(task)));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.post('/tasks', async function (req: Request, res: Response) {
    try {
      const tasks = await taskService.createTask(req.body);
      const taskOrder = await taskService.getTaskOrdering();
      return res.send({ updatedTask: castTask(tasks[0]), ordering: taskOrder });
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.put('/tasks/:id', async function (
    req: Request & { io: any; userId: string },
    res: Response
  ) {
    try {
      const updatedTask: ClientTask = req.body;
      const task = await taskService.modifyTask(updatedTask, req.params.id);
      const taskOrder = await taskService.getTaskOrdering();
      const response = {
        task: castTask(task),
        ordering: taskOrder,
        userId: req.userId,
      };
      req.io.emit(SocketMessages.TASKS, response); // * Emit Publisher signal
      return res.send(response);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.delete('/tasks/:id', async function (req: Request, res: Response) {
    try {
      await taskService.removeTask(req.params.id);
      const taskOrder = await taskService.getTaskOrdering();
      res.send({ task: JSON.stringify({}), ordering: taskOrder });
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });
};

export default tasksController;
