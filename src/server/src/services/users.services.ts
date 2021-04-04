import { getConnection, Repository } from 'typeorm';
import { User } from 'entity/User';
import { UserInput } from '../../../types/user';
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
    const personService = new PersonService();
    const person = await personService.getPersonById(user.person_id);
    return person;
  }

  async createUser(user: UserInput): Promise<User> {
    const { loginEmail: email, password, role } = user;

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
    this.updateLogin(repoUser.id); // Todo: test this
    return this.userRepository.save(repoUser);
  }

  async modifyUser(user: Partial<User> & { id: string }): Promise<User> {
    console.log('user to be modified:', user);
    const snakeUser = snakeCasify(user);
    const currentUser = await this.getUserById(user.id);
    const newUser = this.userRepository.merge(snakeUser, currentUser);
    return await this.userRepository.save(newUser);
  }

  async updateLogin(userId: string): Promise<User> {
    console.log('Updating login for user:', userId);
    const d = new Date();
    console.log('d:', d);
    const currentUser = await this.getUserById(userId);
    const moddedUser = { ...currentUser, id: userId, last_login: d };
    console.log('moddedUser:', moddedUser);
    return this.modifyUser(moddedUser);
  }

  async getLastLogin(userId: string): Promise<string | Date> {
    const user = await this.getUserById(userId);
    return user.last_login;
  }
}
