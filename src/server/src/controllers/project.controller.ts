import { Router } from 'express';
import { ProjectService } from 'services/project.service';
import { Request, Response } from 'express';
import { createErrorResponse } from 'utils';
import { castProject } from 'cast';

const projectController = (router: Router): void => {
  const projectService = new ProjectService();

  router.get('/projects', async function (req: Request, res: Response) {
    const projects = await projectService.getProjects();
    res.json(projects.map(project => castProject(project)));
  });

  router.post('/projects', async function (req: Request, res: Response) {
    try {
      console.log('req.body:', req.body);
      const project = await projectService.createProject(req.body);
      console.log('Project:', project);
      return res.send(castProject(project));
    } catch (e) {
      console.error(e);
      res.status(500);
      return res.send(createErrorResponse(['Personnel could not be updated.']));
    }
  });
};

export default projectController;
