import { Router } from 'express';
import { Request, Response } from 'express';
import { ProjectPersonnelService } from 'services/projectPersonnel.services';
import { createErrorResponse } from 'utils';
import { castProjectPerson } from 'cast';

const projectPersonnelController = (router: Router): void => {
  const projectPersonnelService = new ProjectPersonnelService();

  router.get('/projectPersonnel', async function (req: Request, res: Response) {
    try {
      const projectPersonnel = await projectPersonnelService.getProjectPersonnel();
      res.json(projectPersonnel);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.get('/projectPersonnel/:projectId', async function (
    req: Request,
    res: Response
  ) {
    try {
      const projectPersonnel = await projectPersonnelService.getProjectPersonnelByProjectId(
        req.params.projectId
      );
      return res.send(castProjectPerson(projectPersonnel));
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.post('/projectPersonnel/', async function (
    req: Request,
    res: Response
  ) {
    try {
      const projectPersonnel = await projectPersonnelService.createProjectPerson(
        req.body
      );
      return res.send(
        projectPersonnel.map(person => castProjectPerson(person))
      );
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });
};
