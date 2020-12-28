import { getConnection, Repository } from 'typeorm';
import { Person } from 'entity/Person';
import { PersonJob } from '../../../types/person';
import { snakeCasify } from 'utils';

export class PersonService {
  personRepository: Repository<Person>;

  constructor() {
    this.personRepository = getConnection().getRepository(Person);
  }
  async getPersonById(id: string): Promise<Person> {
    return await this.personRepository.findOne(id);
  }

  async getPersonByUsername(username: string): Promise<Person> {
    return await this.personRepository.findOne({ username });
  }

  async getPersonnel(): Promise<Person[]> {
    return await this.personRepository.find();
  }

  // Needs to be fixed
  async createPerson(
    person: Partial<Person> & { username: string }
  ): Promise<any> {
    const curPerson = this.personRepository.create({
      ...snakeCasify(person),
      username: person.username,
      job: person.job ? person.job : PersonJob.CODER,
    });
    return await this.personRepository.save(curPerson);
  }

  async modifyPerson(
    person: Partial<Person> & { id: string }
  ): Promise<Person> {
    const curPerson = await this.getPersonById(person.id);
    this.personRepository.merge(curPerson, person);
    return await this.personRepository.save(curPerson);
  }

  async removePerson(id: string): Promise<any> {
    return await this.personRepository.delete(id);
  }
}
