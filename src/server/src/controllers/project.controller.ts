import { Router } from 'express';
import { ProjectService } from 'services/project.service';
import { ProjectPersonnelService } from 'services/projectPersonnel.service';
import { Request, Response } from 'express';
import { createErrorResponse } from 'utils';
import { castProject } from 'cast';

const projectController = (router: Router): void => {
  const projectService = new ProjectService();

  router.get('/projects', async function (req: Request, res: Response) {
    const projects = await projectService.getProjects();
    console.log('RouterGet Projects:', projects);

    // For each project, get the associated personnel, and then assign them to a casted

    res.json(projects);
  });

  router.post('/projects', async function (req: Request, res: Response) {
    console.log('Router post project request');
    try {
      const project = await projectService.createProject(req.body);
      return res.send(castProject(project));
    } catch (e) {
      console.error(e);
      res.status(500);
      return res.send(createErrorResponse(['Project could not be created.']));
    }
  });
};

export default projectController;
