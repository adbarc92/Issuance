import { getConnection, Repository } from 'typeorm';
import { Task } from 'entity/Task';
import { Task as ITask } from '../../../types/task';
import { snakeCasify } from 'utils';

export class TaskService {
  taskRepository: Repository<Task>;

  constructor() {
    this.taskRepository = getConnection().getRepository(Task);
  }

  async getTaskById(id: string): Promise<Task> {
    return await this.taskRepository.findOne(id);
  }

  async getTasks(): Promise<Task[]> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .select('*')
      .orderBy('task.status')
      .orderBy('task.row_index')
      .execute();
  }

  async createTask(task: ITask): Promise<Task[]> {
    const curTask = this.taskRepository.create(snakeCasify(task));
    return await this.taskRepository.save(curTask);
  }

  async modifyTask(updatedTask: ITask, id: string): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    for (const prop in task) {
      task[prop] = updatedTask[prop] ?? task[prop];
    }
    return await this.taskRepository.save(task);
  }

  async removeTask(id: string): Promise<any> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Task)
      .where('id = :id', { id })
      .execute();
    // const result = await this.taskRepository.delete(id);
    // console.log('Result:', result);
    // return result;
  }
}
