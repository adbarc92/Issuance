import { getConnection, Repository } from 'typeorm';
import { Project as EProject } from 'entity/Project';
import { NewProject, Project as IProject } from '../../../types/project';
import { Person as IPerson } from '../../../types/person';
import { Person as EPerson } from 'entity/person';
import { snakeCasify } from 'utils';
import { ProjectPersonnelService } from './projectPersonnel.services';
import { PersonService } from './personnel.services';
import { castProject } from 'cast';
import { TaskService } from './tasks.services';

export class ProjectService {
  projectRepository: Repository<EProject>;

  constructor() {
    this.projectRepository = getConnection().getRepository(EProject);
  }

  async getProjectById(projectId: string): Promise<IProject> {
    const taskService = new TaskService();
    const projectPersonnelService = new ProjectPersonnelService();
    const personService = new PersonService();

    const project = await this.projectRepository.findOne(projectId);

    const tasks = await taskService.getTasksByProjectId(projectId);
    const projectPersonnel = await projectPersonnelService.getProjectPersonnelByProjectId(
      projectId
    );

    const personnel: EPerson[] = [];

    projectPersonnel.forEach(async projectPerson => {
      const person = await personService.getPersonById(projectPerson.person_id);
      personnel.push(person);
    });

    return castProject(project, tasks, personnel);
  }

  async getProjects(): Promise<IProject[]> {
    const eProjects = await this.projectRepository.find();

    // const taskService = new TaskService();
    // const projectPersonnelService = new ProjectPersonnelService();
    // const personService = new PersonService();

    const iProjects = eProjects.map(async eProject => {
      return await this.getProjectById(eProject.id);
    });
    return Promise.all(iProjects).then(values => values);
  }

  async createProject(project: NewProject): Promise<EProject> {
    const { title, description, personnel, deadline } = project;
    const newProject = this.projectRepository.create(
      snakeCasify({ title, description, deadline }) as NewProject
    ); // Create Project
    const repoProject = await this.projectRepository.save(newProject);

    const { id: projectId } = repoProject;

    const projectPersonnelService = new ProjectPersonnelService();

    personnel.forEach(async person => {
      await projectPersonnelService.createProjectPerson({
        projectId,
        personId: person.id,
      });
    });

    return;
  }
}
