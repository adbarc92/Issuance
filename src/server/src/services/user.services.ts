import { getConnection, Repository } from 'typeorm';
import { User } from 'entity/User';
import { UserInput } from '../../../types/user';
import { snakeCasify } from 'utils';
import { PersonService } from 'services/personnel.services';

import { saltHashPassword } from 'utils';

export class UserService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = getConnection().getRepository(User);
  }

  // getUserById;
  // getUserByUsername;

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async createUser(user: UserInput): Promise<User> {
    const { loginEmail: email, password, role } = user;

    const personService = new PersonService();

    const person = await personService.createPerson({ userEmail: email });

    const person_id = person.id;

    const { salt, passwordHash: hashed_password } = saltHashPassword(password);

    const newUser = {
      email,
      hashed_password,
      salt,
      role,
      person_id,
    };
    const repoUser = this.userRepository.create(snakeCasify(newUser) as User);
    return this.userRepository.save(repoUser);
  }
}
