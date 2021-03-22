import { getConnection, Repository } from 'typeorm';
import { Comment as CommentEntity } from 'entity/Comment';
import {
  ClientComment,
  NewComment,
  personedComment,
} from '../../../types/comment';
import { snakeCasify, toCamelCase } from 'utils';

import { castPersonComment } from 'cast';

import { PersonService } from 'services/personnel.services';

export class CommentsService {
  commentRepository: Repository<CommentEntity>;

  constructor() {
    this.commentRepository = getConnection().getRepository(CommentEntity);
  }

  async createComment(comment: NewComment): Promise<personedComment> {
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
    console.log('repoComment:', repoComment);
    const personService = new PersonService();
    const fixedComment = castPersonComment(repoComment);
    fixedComment.commenter = await personService.getPersonById(
      repoComment.commenter_id
    );
    console.log('fixedComment:', fixedComment);
    return fixedComment;
  }

  async getCommentsByTaskId(taskId: string): Promise<personedComment[]> {
    const personService = new PersonService();
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .select('*')
      .where('task_id = :id', { id: taskId })
      .execute();

    const personedComments: personedComment[] = comments.map(comment =>
      castPersonComment(comment)
    );

    for (let i = 0; i < personedComments.length; i++) {
      const person = await personService.getPersonById(
        comments[i].commenter_id
      );
      personedComments[i].commenter = person;
    }
    return personedComments;
  }

  async getCommentById(commentId: string): Promise<personedComment> {
    const comment = await this.commentRepository.findOne({ id: commentId });
    const personedComment = castPersonComment(comment);

    const personService = new PersonService();

    personedComment.commenter = await personService.getPersonById(
      comment.commenter_id
    );

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

    // let newIndex = fixInputComment(updatedComment).index;
    let newIndex = updatedComment.index;
    const oldIndex = oldComment.index;

    if (newIndex !== oldIndex) {
      if (newIndex > oldIndex) {
        newIndex -= 1;
        updatedComment.index -= 1;
        // Close original gap: substract 1 from everything >= oldIndex
        await this.commentRepository
          .createQueryBuilder()
          .update('task')
          .set({ row_index: () => 'row_index - 1' })
          .where('row_index > :id', { id: oldIndex })
          .execute();
        // Open a gap at the new index: add 1 to everything >= newIndex
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
        // Open a gap at the new index: add 1 to everything >= newIndex
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

    return await this.commentRepository.save(oldComment);
  }
}
