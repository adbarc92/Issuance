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
      const tasks = taskService.createTask(req.body);
      return res.send(castTask(tasks[0]));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.put('/tasks/:id', async function (req: Request, res: Response) {
    const updatedTask: ITask = req.body;
    const task = await taskService.modifyTask(updatedTask, req.params.id);
    return res.send(castTask(task));
  });

  router.delete('/tasks/:id', async function (req: Request, res: Response) {
    try {
      await taskService.removeTask(req.params.id);
      res.send(JSON.stringify({}));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });
};

export default taskController;
