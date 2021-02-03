import { getConnection, Repository } from 'typeorm';
import { Project } from 'entity/Project';
import { snakeCasify } from 'utils';

export class ProjectService {
  projectRepository: Repository<Project>;

  constructor() {
    this.projectRepository = getConnection().getRepository(Project);
  }

  async getProjectById(id: string): Promise<Project> {
    return await this.projectRepository.findOne(id);
  }

  // async getProjectByTitle(title: string): Promise<Project> {
  //   return await this.projectRepository.findOne({ title });
  // }

  async getProjects(): Promise<Project[]> {
    return await this.projectRepository.find();
  }

  async createProject(project: Project): Promise<Project> {
    const snakeProject = snakeCasify(project);

    const repoProject = this.projectRepository.create(snakeProject as Project);

    return this.projectRepository.save(repoProject);
  }
}
