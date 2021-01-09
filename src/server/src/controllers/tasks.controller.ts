import { Router } from 'express';
import { TaskService } from 'services/tasks.services';
import { Request, Response } from 'express';
import { castTask } from 'cast';
import { createErrorResponse } from 'utils';
import { Task as ITask } from '../../../types/task';

const taskController = (router: Router): void => {
  const taskService = new TaskService();

  router.get('/tasks/:id', async function (req: Request, res: Response) {
    const task = await taskService.getTaskById(req.params.id);
    return res.send(castTask(task));
  });

  router.get('/tasks', async function (req: Request, res: Response) {
    try {
      // Group by Status, Order by Row Index
      const tasks = await taskService.getTasks();
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
      // return res.send(castTask(tasks[0]));
      return res.send({ updatedTask: castTask(tasks[0]), ordering: taskOrder });
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.put('/tasks/:id', async function (req: Request, res: Response) {
    try {
      const updatedTask: ITask = req.body;
      const task = await taskService.modifyTask(updatedTask, req.params.id);
      const taskOrder = await taskService.getTaskOrdering();
      console.log('taskOrder:', taskOrder);
      return res.send({ task: castTask(task), ordering: taskOrder });
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

export default taskController;
