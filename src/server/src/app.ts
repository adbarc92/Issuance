import express from 'express';
import { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { User } from 'entity/User';
import { Token } from 'entity/Token';
// import * as expressWinston from 'express-winston';
// import { format } from 'winston';
// import * as winston from 'winston';

import { v4 as uuid } from 'uuid';
import { createErrorResponse, sha256 } from 'utils';

import ormconfig from '../ormconfig.json';

import personnelController from 'controllers/personnel.controller';
import taskController from 'controllers/tasks.controller';
import userController from 'controllers/users.controller';
import projectsController from 'controllers/projects.controller';
import commentsController from 'controllers/comments.controller';
import imgurController from 'controllers/imgur.controller';

import upload from 'express-fileupload';

import socketIo from 'socket.io';
import http from 'http';
import { UserService } from 'services/users.services';

const port = 4000;

const init = async () => {
  const connection = await createConnection({
    ...ormconfig,
    synchronize: false,
  } as any);
  await connection.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await connection.close();
};

// create typeorm connection
const start = async () => {
  const connection = await createConnection({
    ...ormconfig,
  } as any);
  try {
    const tokenRepository = connection.getRepository(Token);
    const userRepository = connection.getRepository(User);

    const socketMiddleware = async function (req, res, next) {
      req.io = io;
      next();
    };

    const authMiddleware = async function (req, res, next) {
      console.log('URL:', req.url);

      if (!/^(\/api\/)*/.test(req.url)) {
        // If the request lacks /api, send the file without authorization
        console.log('serve', __dirname + '/' + req.url);
        res.sendFile(__dirname + '/' + req.url);
      } else if (
        req.url === '/api/login' &&
        req.method.toUpperCase() === 'POST'
      ) {
        console.log('Bypassing login');
        next();
      } else if (
        req.url === '/api/users' &&
        req.method.toUpperCase() === 'POST'
      ) {
        console.log('Registering new user');
        next();
      } else {
        const token = req.headers.session;
        if (!token) {
          res.status(403);
          return res.send(createErrorResponse(['Not authorized.']));
        }
        const session = await tokenRepository.findOne(token).catch(() => {
          return;
        });
        console.log('session:', session);
        if (session) {
          req.userId = session.user_id;
          const userService = new UserService();
          userService.updateLogin(session.user_id);
          next();
        } else {
          res.status(403);
          return res.send(createErrorResponse(['Not authorized.']));
        }
      }
    };

    // create and setup express app
    const app = express();
    app.use(express.json());
    app.use(authMiddleware);
    app.use(socketMiddleware);
    // app.use(upload({ createParentPath: true }));
    app.use(upload());

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

    /* Socket IO - Start */
    app.use('/api', router);
    /* Socket IO - End */

    // * Register routes
    personnelController(router);
    taskController(router);
    userController(router);
    projectsController(router);
    commentsController(router);
    imgurController(router);

    // * Should take a token, check validity, return loggedIn status
    router.put('/login', async function (
      req: Request & { userId: string },
      res: Response
    ) {
      return res.send({ loggedIn: true, userId: req.userId });
    });

    // * Take password, hash it, check against stored password (also hashed)
    router.post('/login', async function (req: Request, res: Response) {
      console.log('login post');
      const user = await userRepository
        .findOne({
          email: req.body.email,
        })
        .catch();
      if (user) {
        const userSalt = user.salt;
        const password = req.body.password;
        const isPasswordCorrect =
          sha256(password, userSalt).passwordHash === user.hashed_password;
        if (isPasswordCorrect) {
          const token = await tokenRepository
            .findOne({ user_id: user.id })
            .catch();
          if (token) {
            console.log('user is already logged in:', req.body.email);
            res.send(token.id);
          } else {
            const tokenId = uuid();
            const token = tokenRepository.create({
              id: tokenId,
              user_id: user.id,
            });
            await tokenRepository.save(token);
            return res.send(tokenId);
          }
        } else {
          res.status(403);
          return res.send(createErrorResponse(['Not authorized.']));
        }
      } else {
        console.log(
          'login with email+pw failed: no user found with email:',
          req.body.email
        );
        res.status(403);
        return res.send(createErrorResponse(['Not authorized.']));
      }
    });

    app.use('/api', router);

    // app.listen(port); // start express server

    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // When someone connects, emit a connection
    const io = new socketIo.Server(server);
    io.on('connection', socket => {
      console.log('a user connected');
      io.emit('connection', 'connection'); // the event, the event payload
    });

    // console.log(`Mock-server running on port ${port}`);
  } catch (e) {
    console.error(`Error ${e} has occurred`);
  }
};

const main = async () => {
  await init();
  await start();
};

main();
