import { getConnection, Repository } from 'typeorm';
import { PersonService } from 'services/personnel.services';
import { Project as EProject } from 'entity/Project';
import { NewProject, Project as IProject } from '../../../types/project';
import { snakeCasify } from 'utils';
import { castProject } from 'cast';
import { TaskService } from './tasks.services';

export class ProjectService {
  projectRepository: Repository<EProject>;

  constructor() {
    this.projectRepository = getConnection().getRepository(EProject);
  }

  async getProjectById(projectId: string): Promise<IProject> {
    const project = await this.projectRepository.findOne(projectId);
    const taskService = new TaskService();
    const tasks = await taskService.getTasksByProjectId(projectId);
    const personService = new PersonService();

    const people = tasks.map(async task => {
      return await personService.getPersonById(task.assigned_to);
    });

    return Promise.all(people).then(people =>
      castProject(project, tasks, people)
    );
  }

  async getProjects(): Promise<IProject[]> {
    const eProjects = await this.projectRepository.find();

    const iProjects = eProjects.map(async eProject => {
      return await this.getProjectById(eProject.id);
    });
    return Promise.all(iProjects).then(values => values);
  }

  async createProject(project: NewProject): Promise<EProject> {
    const { title, description, deadline } = project;
    const newProject = this.projectRepository.create(
      snakeCasify({ title, description, deadline }) as NewProject
    );
    return await this.projectRepository.save(newProject);
  }
}
