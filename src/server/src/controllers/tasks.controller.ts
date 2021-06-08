// Todo: Add ConsoleLogs||ConsoleDebug and ConsoleErrors to each controller endpoint; reorder routes according to system
// Todo: Controller should only be used for proxying; all logic--including notification logic--should be contained in services

import { Router } from 'express';
import { TaskService } from 'services/tasks.services';
import { Request, Response } from 'express';
import {
  castTask,
  castCommentedTask,
  castNotification,
  castSubscription,
} from 'cast';
import {
  createErrorResponse,
  createSocketEventName,
  logThenEmit,
  affixUpdateItemToNotification,
  affixItemNameToSubscription,
} from 'utils';
import { ClientTask } from '../../../types/task';
import { SocketMessages } from '../../../types/socket';

import { IoRequest } from 'utils';

import { UpdateItemService } from 'services/updateItems.services';
import { UpdateItemTypes, UpdateItemActions } from '../../../types/updateItem';
import { SubscriptionService } from 'services/subscriptions.services';
import { UserService } from 'services/users.services';
import { SocketEventType } from '../../../types/subscription';
import { NotificationService } from 'services/notifications.services';
import { PersonService } from 'services/personnel.services';

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

      console.log('creating new task:', newTask);

      const updateItemService = new UpdateItemService();
      const personService = new PersonService();

      const newUpdateItem = await updateItemService.createUpdateItem(
        UpdateItemTypes.TASK,
        newTask.id,
        UpdateItemActions.CREATE,
        req.userId
      );

      const assignedPerson = await personService.getPersonById(
        newTask.assigned_to
      );

      if (assignedPerson) {
        const userService = new UserService();

        const assignedUser = await userService.getUserByPersonId(
          assignedPerson.id
        );

        if (assignedUser) {
          const subscriptionService = new SubscriptionService();
          const notificationService = new NotificationService();

          const assignedUserSubscription = await subscriptionService.createSubscription(
            newTask.id,
            assignedUser.id,
            UpdateItemTypes.TASK
          );

          const serverSubscription = await affixItemNameToSubscription(
            assignedUserSubscription
          );

          const clientSubscription = castSubscription(serverSubscription);

          const assignedUserSocketEventName = createSocketEventName(
            SocketEventType.SUBSCRIPTION,
            assignedUserSubscription.subscriber_id
          );

          const newNotification = await notificationService.createNotification(
            assignedUserSubscription,
            newUpdateItem.id
          );

          const serverNotification = await affixUpdateItemToNotification(
            newNotification
          );

          const newClientNotification = castNotification(serverNotification);

          const notificationSocketEventName = createSocketEventName(
            SocketEventType.NOTIFICATION,
            assignedUserSubscription.subscribed_item_id
          );

          logThenEmit(req, assignedUserSocketEventName, clientSubscription);

          logThenEmit(req, notificationSocketEventName, newClientNotification);
        }
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
