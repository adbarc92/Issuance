// Todo: Add ConsoleLogs||ConsoleDebug and ConsoleErrors to each controller endpoint

import { Router } from 'express';
import { PersonService } from 'services/personnel.services';
import { Request, Response } from 'express';
import { createErrorResponse } from 'utils';
import { castPerson } from 'cast';

// * This function sets all the routes
const personnelController = (router: Router): void => {
  const personService = new PersonService();

  router.get('/personnel', async function (req: Request, res: Response) {
    const people = await personService.getPersonnel();
    res.json(people.map(person => castPerson(person)));
  });

  router.get('/personnel/:id', async function (req: Request, res: Response) {
    try {
      const person = await personService.getPersonById(req.params.id);
      return res.send(castPerson(person));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.post('/personnel', async function (req: Request, res: Response) {
    try {
      console.log('req.body:', req.body);
      const person = await personService.createPerson(req.body);
      return res.send(castPerson(person));
    } catch (e) {
      console.error(e);
      res.status(500);
      return res.send(createErrorResponse(['Personnel could not be updated.']));
    }
  });

  router.put('/personnel/:id', async function (req: Request, res: Response) {
    try {
      const person = await personService.modifyPerson(req.body);
      return res.send(castPerson(person));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.delete('/personnel/:id', async function (req: Request, res: Response) {
    const results = await personService.removePerson(req.params.id);
    return res.send(results);
  });
};

export default personnelController;
