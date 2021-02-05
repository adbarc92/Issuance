import { getConnection, Repository } from 'typeorm';
import { ProjectPersonnel } from 'entity/ProjectPersonnel';
import { ProjectPersonnelInput } from '../../../types/projectPersonnel';
import { snakeCasify } from 'utils';
import { PersonService } from 'services/personnel.services';

export class ProjectPersonnelService {
  projectPersonnelRepository: Repository<ProjectPersonnel>;

  constructor() {
    this.projectPersonnelRepository = getConnection().getRepository(
      ProjectPersonnel
    );
  }

  async getProjectPersonnel(): Promise<ProjectPersonnel[]> {
    return await this.projectPersonnelRepository.find();
  }

  async getProjectPersonnelByProjectId(projectId: string) {
    return await this.projectPersonnelRepository
      .createQueryBuilder('projectPersonnel')
      .select('*')
      .where('project_id = :id', { id: projectId })
      .execute();
  }

  async createProjectPerson(projectPerson: ProjectPersonnelInput) {
    const newPerson = this.projectPersonnelRepository.create(
      snakeCasify(projectPerson)
    );
    return this.projectPersonnelRepository.save(newPerson);
  }
}
