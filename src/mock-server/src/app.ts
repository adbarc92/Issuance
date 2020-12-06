import * as express from 'express';
import { Request, Response } from 'express';
import { createConnection, createQueryBuilder } from 'typeorm';
import { Person } from 'entity/Person';
import { User } from 'entity/User';
import { Task } from 'entity/Task';
import { Token } from 'entity/Token';
import { Task as ITask } from '../../types/task';
import * as expressWinston from 'express-winston';
// import { format } from 'winston';
import * as winston from 'winston';
import { castTask } from 'cast';
import { v4 as uuid } from 'uuid';

const port = 4000;

// create typeorm connection
createConnection()
  .then(connection => {
    const personRepository = connection.getRepository(Person);

    const taskRepository = connection.getRepository(Task);

    const tokenRepository = connection.getRepository(Token);

    const userRepository = connection.getRepository(User);

    const authMiddleware = async function (req, res, next) {
      // const { rawHeaders, httpVersion, method, socket, url } = req;
      console.log('URL:', req.url);

      if (req.url === '/api/login' && req.method.toUpperCase() === 'POST') {
        console.log('Bypassing login');
        next();
      } else {
        const token = req.headers.session;
        if (!token) {
          res.status(403);
          res.send('Not authorized.');
          return;
        }
        const session = await tokenRepository.findOne(token).catch(() => {
          return;
        });
        console.log('session:', session);
        if (session) {
          next();
        } else {
          res.status(403);
          res.send('Not authorized.');
          return;
        }
      }
    };

    // create and setup express app
    const app = express();
    app.use(express.json());
    app.use(authMiddleware);

    // app.use(
    //   expressWinston.logger({
    //     transports: [new winston.transports.Console()],
    //     meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    //     msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    //     expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    //     colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    //     // ignoreRoute: function (req, res) {
    //     //   return false;
    //     // }, // optional: allows to skip some log messages based on request and/or response
    //   })
    // );

    const router = express.Router();

    // register routes

    router.get('/personnel', async function (req: Request, res: Response) {
      const person = await personRepository.find();
      res.json(person);
    });

    router.get('/personnel/:id', async function (req: Request, res: Response) {
      const results = await personRepository.findOne(req.params.id);
      return res.send(results);
    });

    router.post('/personnel', async function (req: Request, res: Response) {
      const person = personRepository.create(req.body);
      const results = await personRepository.save(person);
      return res.send(results);
    });

    router.put('/personnel/:id', async function (req: Request, res: Response) {
      const personnel = await personRepository.findOne(req.params.id);
      personRepository.merge(personnel, req.body);
      const results = await personRepository.save(personnel);
      return res.send(results);
    });

    router.delete('/personnel/:id', async function (
      req: Request,
      res: Response
    ) {
      const results = await personRepository.delete(req.params.id);
      return res.send(results);
    });

    router.get('/personnel/', async function (req: Request, res: Response) {
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

    router.put('/tasks/:id', async function (req: Request, res: Response) {
      const updatedTask: ITask = req.body;
      console.log('updatedTask:', updatedTask);
      const task = await taskRepository.findOne(req.params.id);
      for (const prop in task) {
        task[prop] = updatedTask[prop] ?? task[prop];
      }
      const result = await taskRepository.save(task);
      return res.send(castTask(result));
    });

    router.put('/login', async function (req: Request, res: Response) {
      return res.send(true);
    });

    // Take password, hash it, check against stored password (also hashed)
    router.post('/login', async function (req: Request, res: Response) {
      console.log('login post');
      const user = await userRepository
        .findOne({
          login_email: req.body.email,
        })
        .catch();
      if (user) {
        const token = await tokenRepository
          .findOne({ userId: user.id })
          .catch();
        if (token) {
          console.log('user is already logged in:', req.body.email);
          res.send(token.id);
        } else {
          const tokenId = uuid();
          const token = tokenRepository.create({
            id: tokenId,
            userId: user.id,
          });
          await tokenRepository.save(token);
          return res.send(tokenId);
        }
      } else {
        console.log(
          'login with email+pw failed: no user found with email:',
          req.body.email
        );
        res.status(403);
        return res.send('Not authorized.');
      }
    });

    app.use('/api', router);
    // start express server
    app.listen(port);

    console.log(`Mock-server running on port ${port}`);
  })
  .catch(err => console.error(`Error ${err} has occurred`));
