import { getConnection, Repository } from 'typeorm';
import { Task } from 'entity/Task';
import { Task as ITask } from '../../../types/task';
import { snakeCasify, toCamelCase, toSnakeCase } from 'utils';

export class TaskService {
  taskRepository: Repository<Task>;

  constructor() {
    this.taskRepository = getConnection().getRepository(Task);
  }

  async getTaskById(id: string): Promise<Task> {
    return await this.taskRepository.findOne(id);
  }

  async getTaskOrdering(): Promise<{ id: string }[]> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .select('id')
      .orderBy('task.status')
      .orderBy('task.row_index')
      .execute();
  }

  async getTasks(): Promise<Task[]> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .select('*')
      .orderBy('task.status')
      .orderBy('task.row_index')
      .execute();
  }

  // async countTaskStatus(status: string): Promise<number> {
  //   return await this.taskRepository
  //     .createQueryBuilder()
  //     .select('*')
  //     .where('task.status === ' + status)
  //     .getCount();
  // }

  async createTask(task: ITask): Promise<Task[]> {
    const curTask = this.taskRepository.create(snakeCasify(task));
    await this.taskRepository
      .createQueryBuilder()
      .update('task')
      .set({ row_index: () => 'row_index + 1' })
      .where('row_index >= 0')
      .execute();
    return await this.taskRepository.save(curTask);
  }

  // Pass in either

  async modifyTask(updatedTask: ITask, id: string): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    let newIndex = updatedTask.rowIndex;
    const oldIndex = task.row_index;

    // console.log('task:', this.countTaskStatus(task.status));
    if (newIndex !== oldIndex) {
      if (newIndex > oldIndex) {
        newIndex -= 1;
        updatedTask.rowIndex -= 1;
        // 5 => 2
        // Close original gap: substract 1 from everything >= oldIndex
        await this.taskRepository
          .createQueryBuilder()
          .update('task')
          .set({ row_index: () => 'row_index - 1' })
          .where('row_index > :id', { id: oldIndex })
          .execute();
        // Open a gap at the new index: add 1 to everything >= newIndex
        await this.taskRepository
          .createQueryBuilder()
          .update('task')
          .set({ row_index: () => 'row_index + 1' })
          .where('row_index >= :id', { id: newIndex })
          .execute();
      } else {
        await this.taskRepository
          .createQueryBuilder()
          .update('task')
          .set({ row_index: () => 'row_index - 1' })
          .where('row_index > :id', { id: oldIndex })
          .execute();
        // Open a gap at the new index: add 1 to everything >= newIndex
        await this.taskRepository
          .createQueryBuilder()
          .update('task')
          .set({ row_index: () => 'row_index + 1' })
          .where('row_index >= :id', { id: newIndex })
          .execute();
      }
    }

    for (const prop in task) {
      const camelProp = toCamelCase(prop);

      task[prop] = updatedTask[camelProp] ?? task[prop];
      console.log(
        'camelProp:',
        camelProp,
        'prop:',
        prop,
        'task[prop]:',
        task[prop],
        'updatedTask[camelProp]:',
        updatedTask[camelProp]
      );
    }

    console.log('SavedTask:', task);
    return await this.taskRepository.save(task);
  }

  async removeTask(id: string): Promise<any> {
    const taskToDelete = await this.taskRepository.findOne(id);
    const deletedIndex = taskToDelete.row_index;
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Task)
      .where('id = :id', { id })
      .execute();
    await this.taskRepository
      .createQueryBuilder()
      .update('task')
      .set({ row_index: () => 'row_index - 1' })
      .where('row_index >= :id', { id: deletedIndex })
      .execute();
    // return await this.taskRepository.save();
  }
}
