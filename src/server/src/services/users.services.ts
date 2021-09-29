import { getConnection, Repository } from 'typeorm';
import { UserEntity } from 'entity/User';
import { UserInput } from '../../../types/user';
import { PersonEntity } from 'entity/Person';
import { snakeCasify } from 'utils';
import { PersonService } from 'services/personnel.services';

import { saltHashPassword } from 'utils';

export class UserService {
  userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = getConnection().getRepository(UserEntity);
  }

  async getUserById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getUserPersonById(userId: string): Promise<PersonEntity> {
    const user = await this.getUserById(userId);
    const personService = new PersonService();
    const person = await personService.getPersonById(user.person_id);
    return person;
  }

  async getUserByPersonId(person_id: string): Promise<UserEntity | null> {
    try {
      return await this.userRepository.findOne({ person_id });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async createUser(user: UserInput): Promise<UserEntity> {
    const { loginEmail: email, password, role } = user;

    const users: UserEntity[] = await this.userRepository.find();

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
    // this.updateLogin(repoUser.id); // Todo: test this
    return this.userRepository.save(repoUser);
  }

  async modifyUser(
    user: Partial<UserEntity> & { id: string }
  ): Promise<UserEntity> {
    const snakeUser = snakeCasify(user);
    const currentUser = await this.getUserById(user.id);
    const newUser = this.userRepository.merge(currentUser, snakeUser);
    return await this.userRepository.save(newUser);
  }
}
