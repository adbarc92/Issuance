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

  async getPersonByUserEmail(user_email: string): Promise<Person> {
    return await this.personRepository.findOne({ user_email });
  }

  async getPersonnel(): Promise<Person[]> {
    return await this.personRepository.find();
  }

  async createPerson(
    person: Partial<Person> & { userEmail: string }
  ): Promise<Person> {
    const snakeCasePerson = snakeCasify(person);
    const curPerson = this.personRepository.create({
      ...snakeCasePerson,
      userEmail: person.userEmail,
      job: person.job ? person.job : PersonJob.CODER,
    } as Person); // * BugFix: using spread inside create causes it to treat the argument as an array rather than a single object
    return this.personRepository.save(curPerson);
  }

  async modifyPerson(
    person: Partial<Person> & { id: string }
  ): Promise<Person> {
    const snakePerson = snakeCasify(person);
    const curPerson = await this.getPersonById(person.id);
    const newPerson = this.personRepository.merge(snakePerson, curPerson);
    return await this.personRepository.save(newPerson);
  }

  async removePerson(id: string): Promise<any> {
    return await this.personRepository.delete(id);
  }
}
