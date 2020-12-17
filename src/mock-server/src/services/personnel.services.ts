import { getConnection, Repository } from 'typeorm';
import { Person } from 'entity/Person';
import { User } from 'entity/User';
import { PersonJob, Person as IPerson } from '../../../types/person';

export class PersonService {
  personRepository: Repository<Person>;

  constructor() {
    this.personRepository = getConnection().getRepository(Person);
  }
  async getPerson(id: string): Promise<Person> {
    return this.personRepository.findOne(id);
  }

  async getPersonnel(): Promise<Person[]> {
    return this.personRepository.find();
  }

  // Needs to be fixed
  async createPerson(
    person: Partial<Person> & { firstName: string }
  ): Promise<any> {
    const curPerson = this.personRepository.create({
      first_name: person.firstName,
      job: PersonJob.CODER,
      ...person,
    });
    return this.personRepository.save(curPerson);
  }

  async modifyPerson(
    person: Partial<Person> & { id: string }
  ): Promise<Person> {
    const curPerson = await this.getPerson(person.id);
    this.personRepository.merge(curPerson, person);
    return this.personRepository.save(curPerson);
  }

  async removePerson(id: string): Promise<any> {
    return this.personRepository.delete(id);
  }
}
