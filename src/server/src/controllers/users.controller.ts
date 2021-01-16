import { Router } from 'express';
import { Request, Response } from 'express';
import { UserService } from 'services/user.services';
import { createErrorResponse } from 'utils';

// The Controller defines the endpoints, receives the requests, and passes them along to services. Logic resides in the services.

const userController = (router: Router): void => {
  const userService = new UserService();

  router.get('/users', async function (req: Request, res: Response) {
    try {
      const users = await userService.getUsers();
      res.json(users);
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
      return res.send(user);
    } catch (e) {
      console.error('Error occurred:', e);
      res.status(403);
      return res.send(createErrorResponse(['Not authorized.']));
    }
  });
};

export default userController;
