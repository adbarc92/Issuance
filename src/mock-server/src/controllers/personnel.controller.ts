import { Router } from 'express';
import { PersonService } from 'services/personnel.services';
import { Request, Response } from 'express';

// This function sets all the routes
const personnelController = (router: Router): void => {
  const personService = new PersonService();

  router.get('/personnel', async function (req: Request, res: Response) {
    const person = await personService.getPersonnel();
    res.json(person);
  });

  router.get('/personnel/:id', async function (req: Request, res: Response) {
    const results = await personService.getPerson(req.params.id);
    return res.send(results);
  });

  router.post('/personnel', async function (req: Request, res: Response) {
    console.log('req.body:', req.body);
    const results = await personService.createPerson(req.body);
    return res.send(results);
  });

  router.put('/personnel/:id', async function (req: Request, res: Response) {
    const results = await personService.modifyPerson(req.body);
    return res.send(results);
  });

  router.delete('/personnel/:id', async function (req: Request, res: Response) {
    const results = await personService.removePerson(req.params.id);
    return res.send(results);
  });
};

export default personnelController;
