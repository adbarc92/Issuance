import { getConnection, Repository } from 'typeorm';
import { PersonService } from 'services/personnel.services';
import { Project as ProjectEntity } from 'entity/Project';
import { NewProject, Project as IProject } from '../../../types/project';
import { snakeCasify, toCamelCase } from 'utils';
import { castProject } from 'cast';
import { TaskService } from 'services/tasks.services';

export class ProjectService {
  projectRepository: Repository<ProjectEntity>;

  constructor() {
    this.projectRepository = getConnection().getRepository(ProjectEntity);
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

  async createProject(project: NewProject): Promise<ProjectEntity> {
    const { title, description, deadline } = project;
    const newProject = this.projectRepository.create(
      snakeCasify({ title, description, deadline }) as NewProject
    );
    return await this.projectRepository.save(newProject);
  }

  async modifyProject(
    updatedProject: IProject,
    id: string
  ): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne(id);

    for (const prop in project) {
      const camelProp = toCamelCase(prop);
      project[prop] = updatedProject[camelProp] ?? project[prop];
    }

    return await this.projectRepository.save(project);
  }
}
