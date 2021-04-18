import { getConnection, Repository } from 'typeorm';
import { CommentEntity } from 'entity/Comment';
import {
  ClientComment,
  NewComment,
  commentEntityWithPersonEntity,
} from '../../../types/comment';
import { snakeCasify, toCamelCase, affixPersonToComment } from 'utils';

import { PersonService } from 'services/personnel.services';

export class CommentService {
  commentRepository: Repository<CommentEntity>;

  constructor() {
    this.commentRepository = getConnection().getRepository(CommentEntity);
  }

  async createComment(
    comment: NewComment
  ): Promise<commentEntityWithPersonEntity> {
    const snakeComment: NewComment = snakeCasify(comment);
    const newComment: CommentEntity = this.commentRepository.create(
      snakeComment
    );
    await this.commentRepository
      .createQueryBuilder()
      .update('comment')
      .set({ index: () => 'index + 1' })
      .where('index >= 1')
      .execute();

    const repoComment = await this.commentRepository.save(newComment);

    const fixedComment = await affixPersonToComment(repoComment);

    return fixedComment;
  }

  async getCommentsByTaskId(
    taskId: string
  ): Promise<commentEntityWithPersonEntity[]> {
    const personService = new PersonService();
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .select('*')
      .where('task_id = :id', { id: taskId })
      .execute();

    const personedComments: commentEntityWithPersonEntity[] = [];

    for (let i = 0; i < comments.length; i++) {
      const person = await personService.getPersonById(
        comments[i].commenter_id
      );
      const personedComment = await affixPersonToComment(comments[i]);
      personedComments.push(personedComment);
    }
    return personedComments;
  }

  async getCommentById(
    commentId: string
  ): Promise<commentEntityWithPersonEntity> {
    const comment = await this.commentRepository.findOne({ id: commentId });

    const personedComment = await affixPersonToComment(comment);

    return personedComment;
  }

  async removeComment(commentId: string): Promise<CommentEntity> {
    const commentToRemove = await this.commentRepository.findOne({
      id: commentId,
    });
    const removedIndex = commentToRemove.index;
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(CommentEntity)
      .where('id = :id', { id: commentId })
      .execute();

    await this.commentRepository
      .createQueryBuilder()
      .update('comment')
      .set({ index: () => 'index - 1' })
      .where('index >= :id', { id: removedIndex })
      .execute();

    return commentToRemove;
  }

  async modifyComment(
    commentId: string,
    updatedComment: ClientComment
  ): Promise<CommentEntity> {
    const oldComment = await this.commentRepository.findOne(commentId);

    let newIndex = updatedComment.index;
    const oldIndex = oldComment.index;

    if (newIndex !== oldIndex) {
      if (newIndex > oldIndex) {
        newIndex -= 1;
        updatedComment.index -= 1;
        // * Close original gap: substract 1 from everything >= oldIndex
        await this.commentRepository
          .createQueryBuilder()
          .update('task')
          .set({ row_index: () => 'row_index - 1' })
          .where('row_index > :id', { id: oldIndex })
          .execute();
        // * Open a gap at the new index: add 1 to everything >= newIndex
        await this.commentRepository
          .createQueryBuilder()
          .update('task')
          .set({ row_index: () => 'row_index + 1' })
          .where('row_index >= :id', { id: newIndex })
          .execute();
      } else {
        await this.commentRepository
          .createQueryBuilder()
          .update('task')
          .set({ row_index: () => 'row_index - 1' })
          .where('row_index > :id', { id: oldIndex })
          .execute();
        // * Open a gap at the new index: add 1 to everything >= newIndex
        await this.commentRepository
          .createQueryBuilder()
          .update('task')
          .set({ row_index: () => 'row_index + 1' })
          .where('row_index >= :id', { id: newIndex })
          .execute();
      }
    }

    for (const prop in oldComment) {
      const camelProp = toCamelCase(prop);

      oldComment[prop] = updatedComment[camelProp] ?? oldComment[prop];
    }

    const fixedComment = await this.commentRepository.save(oldComment);

    return fixedComment;
  }
}
