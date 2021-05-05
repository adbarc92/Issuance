// Todo: Add ConsoleLogs||ConsoleDebug and ConsoleErrors to each controller endpoint; reorder routes according to system

import { Router } from 'express';
import { TaskService } from 'services/tasks.services';
import { Request, Response } from 'express';
import { castTask, castCommentedTask } from 'cast';
import { createErrorResponse } from 'utils';
import { ClientTask } from '../../../types/task';
import { SocketMessages } from '../../../types/socket';

import { IoRequest } from 'utils';

import { UpdateItemService } from 'services/updateItems.services';
import { UpdateItemTypes, UpdateItemActions } from '../../../types/updateItem';
import { SubscriptionService } from 'services/subscriptions.services';

const tasksController = (router: Router): void => {
  const taskService = new TaskService();

  router.get('/tasks/:id', async function (req: Request, res: Response) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      const commentedTask = castCommentedTask(task);
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

  router.post('/tasks', async function (
    req: Request & { io: any; userId: string },
    res: Response
  ) {
    try {
      const newTask = await taskService.createTask(req.body);

      const updateItemService = new UpdateItemService();

      const newUpdateItem = await updateItemService.addUpdateItem(
        UpdateItemTypes.TASK,
        newTask.id,
        UpdateItemActions.CREATE,
        req.userId
      );

      // const updateItemResponse = {
      //   updateItem: castUpdateItem(newUpdateItem),
      //   userId: req.userId,
      // };

      // req.io.emit(SocketMessages.UPDATE_ITEMS, updateItemResponse);

      if (newTask.assigned_to) {
        const subscriptionService = new SubscriptionService();

        subscriptionService.createSubscription(
          newTask.id,
          newTask.assigned_to,
          UpdateItemTypes.TASK
        );
      }

      const taskOrder = await taskService.getTaskOrdering();
      return res.send({ updatedTask: castTask(newTask), ordering: taskOrder });
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

      console.log('updatedTask:', updatedTask);

      const task = await taskService.modifyTask(updatedTask, req.params.id);

      console.log('task:', task);

      // Todo: create updateItem, subscription, and maybe notification

      // const updateItemResponse = {
      //   updateItem: castUpdateItem(newUpdateItem),
      //   userId: req.userId,
      // };

      // req.io.emit(SocketMessages.UPDATE_ITEMS, updateItemResponse);

      const taskOrder = await taskService.getTaskOrdering();
      const response = {
        task: castTask(task),
        ordering: taskOrder,
        userId: req.userId,
      };

      console.log('response:', response);
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
