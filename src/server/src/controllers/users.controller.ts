import { Router } from 'express';
import { Request, Response } from 'express';
import { UserService } from 'services/users.services';
import { createErrorResponse } from 'utils';
import { castUser, castPerson } from 'cast';

// The Controller defines the endpoints, receives the requests, and passes them along to services. Logic resides in the services.

const usersController = (router: Router): void => {
  const userService = new UserService();

  router.get('/users', async function (req: Request, res: Response) {
    try {
      const users = await userService.getUsers();
      res.json(users.map(user => castUser(user)));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.get('/users/:id', async function (req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(castUser(user));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.post('/users', async function (req: Request, res: Response) {
    try {
      const { loginEmail, userPassword: password, userRole: role } = req.body;

      const user = await userService.createUser({
        loginEmail,
        password,
        role,
      });

      if (!user) {
        console.error('User already exists.');
        res.status(409);
        return res.send(createErrorResponse(['User already exists.']));
      }

      return res.send(castUser(user));
    } catch (e) {
      console.error('Error occurred:', e);
      res.status(403);
      return res.send(createErrorResponse(['Not authorized.']));
    }
  });

  router.get('/users/person/:id', async function (req: Request, res: Response) {
    try {
      const person = await userService.getUserPersonById(req.params.id);
      console.log('controller person:', person);
      res.json(castPerson(person));
    } catch (e) {
      console.error('Error occurred:', e);
      res.status(500);
      return res.send(createErrorResponse(['Not authorized.']));
    }
  });
};

export default usersController;
