import * as express from 'express';
import { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { User } from 'entity/User';
import { Task } from 'entity/Task';
import { Task as ITask } from '../../types/task';
import * as expressWinston from 'express-winston';
// import { format } from 'winston';
import * as winston from 'winston';
import { castTask } from 'cast';

const port = 4000;

// create typeorm connection
createConnection()
  .then(connection => {
    const userRepository = connection.getRepository(User);

    const taskRepository = connection.getRepository(Task);

    // create and setup express app
    const app = express();
    app.use(express.json());

    app.use(
      expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
          winston.format.colorize()
          // winston.format.json()
        ),
        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
        msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
        // ignoreRoute: function (req, res) {
        //   return false;
        // }, // optional: allows to skip some log messages based on request and/or response
      })
    );

    const router = express.Router();

    // register routes

    router.get('/users', async function (req: Request, res: Response) {
      const users = await userRepository.find();
      res.json(users);
    });

    router.get('/users/:id', async function (req: Request, res: Response) {
      const results = await userRepository.findOne(req.params.id);
      return res.send(results);
    });

    // Return the user object
    router.post('/users', async function (req: Request, res: Response) {
      const user = userRepository.create(req.body);
      const results = await userRepository.save(user);
      return res.send(results);
    });

    router.put('/users/:id', async function (req: Request, res: Response) {
      const user = await userRepository.findOne(req.params.id);
      userRepository.merge(user, req.body);
      const results = await userRepository.save(user);
      return res.send(results);
    });

    router.delete('/users/:id', async function (req: Request, res: Response) {
      const results = await userRepository.delete(req.params.id);
      return res.send(results);
    });

    router.get('/tasks/', async function (req: Request, res: Response) {
      const results = await taskRepository.find();
      res.json(results.map(castTask));
    });

    router.get('/tasks/:id', async function (req: Request, res: Response) {
      const task = await taskRepository.findOne(req.params.id);
      return res.send(castTask(task));
    });

    router.post('/tasks', async function (req: Request, res: Response) {
      const task = taskRepository.create(req.body);
      const result = await taskRepository.save(task);
      return res.send(castTask(result[0]));
    });

    router.put('/task/:id', async function (req: Request, res: Response) {
      const updatedTask: ITask = req.body;
      console.log('updatedTask:', updatedTask);
      const task = await taskRepository.findOne(req.params.id);
      for (const prop in task) {
        task[prop] = updatedTask[prop] ?? task[prop];
      }
      const result = await taskRepository.save(task);
      return res.send(castTask(result));
    });

    app.use('/api', router);
    // start express server
    app.listen(port);

    console.log(`Mock-server running on port ${port}`);
  })
  .catch(err => console.error(`Error ${err} has occurred`));
