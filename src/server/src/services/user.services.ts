import { getConnection, Repository } from 'typeorm';
import { User } from 'entity/User';
import { UserInput } from '../../../types/user';
// import { Person } from '../../../types/person';
import { Person } from 'entity/Person';
import { snakeCasify } from 'utils';
import { PersonService } from 'services/personnel.services';

import { saltHashPassword } from 'utils';

export class UserService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = getConnection().getRepository(User);
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserPersonById(userId: string): Promise<Person> {
    const user = await this.getUserById(userId);
    console.log('user:', user);
    const personService = new PersonService();
    const person = await personService.getPersonById(user.person_id);
    console.log('person:', person);
    return person;
  }

  async createUser(user: UserInput): Promise<User> {
    const { loginEmail: email, password, role } = user;

    // Check if User Exists
    const users: User[] = await this.userRepository.find();

    const userEmails = users.map(user => user.email);

    if (userEmails.includes(email)) {
      console.error('User already exists.');
      return null;
    }

    const personService = new PersonService();

    const person = await personService.createPerson({
      userEmail: email,
    });

    const person_id = person.id;

    const { salt, passwordHash: hashed_password } = saltHashPassword(password);

    const newUser = {
      email,
      hashed_password,
      salt,
      role,
      person_id,
    };
    const snakeUser = snakeCasify(newUser);
    console.log(snakeUser);
    const repoUser = this.userRepository.create(newUser);
    return this.userRepository.save(repoUser);
  }
}
