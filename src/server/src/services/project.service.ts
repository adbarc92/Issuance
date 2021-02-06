import { getConnection, Repository } from 'typeorm';
import { Project as EProject } from 'entity/Project';
import { NewProject, Project as IProject } from '../../../types/project';
import { snakeCasify } from 'utils';
import { ProjectPersonnelService } from './projectPersonnel.service';
import { castProject } from 'cast';
import { ProjectPersonnel } from '../../../types/projectPersonnel';

export class ProjectService {
  projectRepository: Repository<EProject>;

  constructor() {
    this.projectRepository = getConnection().getRepository(EProject);
  }

  async getProjectById(id: string): Promise<EProject> {
    return await this.projectRepository.findOne(id);
  }

  // async getProjectByTitle(title: string): Promise<Project> {
  //   return await this.projectRepository.findOne({ title });
  // }

  async getProjects(): Promise<IProject[]> {
    const projects = await this.projectRepository.find();

    const projectPersonnelService = new ProjectPersonnelService();

    const projectPersonnel = projects.map(async project => {
      const { id } = project;
      const personnel = await projectPersonnelService.getProjectPersonnelByProjectId(
        id
      );
      const combo = { [id]: personnel };
      console.log('Combo:', combo);
      return combo;
    });

    return projects.map(project => castProject(project));
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
