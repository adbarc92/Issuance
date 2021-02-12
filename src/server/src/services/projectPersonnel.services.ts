import { getConnection, Repository } from 'typeorm';
import { ProjectPersonnel as EProjectPersonnel } from 'entity/ProjectPersonnel';
import {
  ProjectPersonInput,
  ProjectPerson,
} from '../../../types/projectPersonnel';
import { snakeCasify } from 'utils';

export class ProjectPersonnelService {
  projectPersonnelRepository: Repository<EProjectPersonnel>;

  constructor() {
    this.projectPersonnelRepository = getConnection().getRepository(
      EProjectPersonnel
    );
  }

  async getProjectPersonnel(): Promise<EProjectPersonnel[]> {
    return await this.projectPersonnelRepository.find();
  }

  async getProjectPersonnelByProjectId(
    projectId: string
  ): Promise<EProjectPersonnel[]> {
    return await this.projectPersonnelRepository
      .createQueryBuilder()
      .select('*')
      .where('project_id = :id', { id: projectId })
      .execute();
  }

  async createProjectPerson(
    projectPerson: ProjectPersonInput
  ): Promise<EProjectPersonnel> {
    const snakePP = snakeCasify(projectPerson);
    const newPerson = this.projectPersonnelRepository.create(
      snakePP as EProjectPersonnel
    );
    return await this.projectPersonnelRepository.save(newPerson);
  }
}
