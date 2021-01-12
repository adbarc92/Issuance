import express from 'express';
import { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { User } from 'entity/User';
import { Token } from 'entity/Token';
// import * as expressWinston from 'express-winston';
// import { format } from 'winston';
// import * as winston from 'winston';

import { v4 as uuid } from 'uuid';
import { createErrorResponse, sha256, saltHashPassword } from 'utils';

import ormconfig from '../ormconfig.json';

import personnelController from 'controllers/personnel.controller';
import taskController from 'controllers/tasks.controller';

const port = 4000;

const init = async () => {
  const connection = await createConnection({
    ...ormconfig,
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
    // const personRepository = connection.getRepository(Person);

    // const taskRepository = connection.getRepository(Task);

    const tokenRepository = connection.getRepository(Token);

    const userRepository = connection.getRepository(User);

    const authMiddleware = async function (req, res, next) {
      // const { rawHeaders, httpVersion, method, socket, url } = req;
      console.log('URL:', req.url);

      if (req.url === '/api/login' && req.method.toUpperCase() === 'POST') {
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
    personnelController(router);
    taskController(router);

    router.post('/users', async function (req: Request, res: Response) {
      // Check for existing user
      try {
        const {
          loginEmail: email,
          userPassword,
          userRole: role,
          personId: person_id,
        } = req.body;
        const { salt, passwordHash: hashed_password } = saltHashPassword(
          userPassword
        );
        const user = {
          email,
          hashed_password,
          salt,
          role,
          person_id,
        };
        console.log('user:', user);
        const repoUser = userRepository.create(user);

        const results = await userRepository.save(repoUser);
        return res.send(results);
      } catch (e) {
        console.error('Error occurred:', e);
        res.status(403);
        return res.send(createErrorResponse(['Not authorized.']));
      }
    });

    router.put('/login', async function (req: Request, res: Response) {
      return res.send(true);
    });

    // Take password, hash it, check against stored password (also hashed)
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
    // start express server
    app.listen(port);

    console.log(`Mock-server running on port ${port}`);
  } catch (e) {
    console.error(`Error ${e} has occurred`);
  }
};

const main = async () => {
  await init();
  await start();
};

main();
