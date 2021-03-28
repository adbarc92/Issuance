import { getConnection, Repository } from 'typeorm';
import { Task as TaskEntity } from 'entity/Task';
import { ClientTask, CommentedTask } from '../../../types/task';
import { snakeCasify, toCamelCase, fixInputTask } from 'utils';
import { CommentsService } from 'services/comments.services';
import { castCommentTask } from 'cast';

export class TaskService {
  taskRepository: Repository<TaskEntity>;

  constructor() {
    this.taskRepository = getConnection().getRepository(TaskEntity);
  }

  async getTaskById(taskId: string): Promise<CommentedTask> {
    const commentsService = new CommentsService();
    const comments = await commentsService.getCommentsByTaskId(taskId);
    const task = await this.taskRepository.findOne({ id: taskId });
    const commentedTask = castCommentTask(task);
    commentedTask.comments = comments;
    return commentedTask;
  }

  async getTaskOrdering(): Promise<{ id: string }[]> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .select('id')
      .orderBy('task.status')
      .orderBy('task.row_index')
      .execute();
  }

  async getTasks(): Promise<TaskEntity[]> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .select('*')
      .orderBy('task.status')
      .orderBy('task.row_index')
      .execute();
  }

  async getTasksByProjectId(projectId: string): Promise<TaskEntity[]> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .select('*')
      .where('project_id = :id', { id: projectId })
      .execute();
  }

  async createTask(task: ClientTask): Promise<TaskEntity[]> {
    fixInputTask(task);
    const curTask = this.taskRepository.create(snakeCasify(task));
    await this.taskRepository
      .createQueryBuilder()
      .update('task')
      .set({ row_index: () => 'row_index + 1' })
      .where('row_index >= 0')
      .execute();
    return await this.taskRepository.save(curTask);
  }

  async modifyTask(updatedTask: ClientTask, id: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne(id);

    let newIndex = updatedTask.rowIndex;
    const oldIndex = task.row_index;

    if (newIndex !== oldIndex) {
      if (newIndex > oldIndex) {
        newIndex -= 1;
        updatedTask.rowIndex -= 1;
        // * Close original gap: substract 1 from everything >= oldIndex
        await this.taskRepository
          .createQueryBuilder()
          .update('task')
          .set({ row_index: () => 'row_index - 1' })
          .where('row_index > :id', { id: oldIndex })
          .execute();
        // * Open a gap at the new index: add 1 to everything >= newIndex
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
        // * Open a gap at the new index: add 1 to everything >= newIndex
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
    }

    return await this.taskRepository.save(task);
  }

  async removeTask(id: string): Promise<any> {
    const taskToDelete = await this.taskRepository.findOne(id);
    const deletedIndex = taskToDelete.row_index;
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(TaskEntity)
      .where('id = :id', { id })
      .execute();
    await this.taskRepository
      .createQueryBuilder()
      .update('task')
      .set({ row_index: () => 'row_index - 1' })
      .where('row_index >= :id', { id: deletedIndex })
      .execute();
  }
}
