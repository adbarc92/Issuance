import { getConnection, Repository } from 'typeorm';
import { PersonEntity } from 'entity/Person';
import { PersonJob } from '../../../types/person';
import { snakeCasify } from 'utils';

export class PersonService {
  personRepository: Repository<PersonEntity>;

  constructor() {
    this.personRepository = getConnection().getRepository(PersonEntity);
  }

  async getPersonById(id: string): Promise<PersonEntity> {
    return this.personRepository.findOne(id);
  }

  async getPersonByUserEmail(user_email: string): Promise<PersonEntity> {
    return this.personRepository.findOne({ user_email });
  }

  async getPersonnel(): Promise<PersonEntity[]> {
    return this.personRepository.find(); // * Await will cover promise chains
  }

  async createPerson(
    person: Partial<PersonEntity> & { userEmail: string }
  ): Promise<PersonEntity> {
    const snakeCasePerson = snakeCasify(person);
    const curPerson = this.personRepository.create({
      ...snakeCasePerson,
      userEmail: person.userEmail,
      job: person.job ? person.job : PersonJob.CODER,
    } as PersonEntity); // * BugFix: using spread inside create causes it to treat the argument as an array rather than a single object
    return this.personRepository.save(curPerson);
  }

  async modifyPerson(
    person: Partial<PersonEntity> & { id: string }
  ): Promise<PersonEntity> {
    console.log('modifying person...', person);
    const snakePerson = snakeCasify(person);
    const curPerson = await this.getPersonById(person.id);
    console.log('curPerson:', curPerson);
    const newPerson = this.personRepository.merge(curPerson, snakePerson);
    console.log('newPerson:', newPerson);
    return await this.personRepository.save(newPerson);
  }

  async removePerson(id: string): Promise<any> {
    return await this.personRepository.delete(id);
  }
}
