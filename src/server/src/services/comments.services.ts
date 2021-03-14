import { getConnection, Repository } from 'typeorm';
import { Comment as EComment } from 'entity/Comment';
import { Comment as IComment } from '../../../types/comment';
import { snakeCasify, toCamelCase } from 'utils';

export class CommentsService {
  commentRepository: Repository<Comment>;

  constructor() {
    this.commentRepository = getConnection().getRepository(Comment);
  }

  async createComment(comment: IComment): Promise<EComment[]> {
    const newComment = this.commentRepository.create(snakeCasify(comment));
    await this.commentRepository
      .createQueryBuilder()
      .update('comment')
      .set({ index: () => 'index + 1' })
      .where('index >= 1')
      .execute();
    return await this.commentRepository.save(newComment);
  }

  async getCommentsByTaskId(taskId: string): Promise<EComment> {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .select('*')
      .where('task_id = :id', { id: taskId })
      .execute();
  }

  async getCommentById(commentId: string): Promise<EComment> {
    return await this.commentRepository.findOne(commentId);
  }

  async removeComment(commentId: string): Promise<EComment> {
    const commentToRemove = await this.commentRepository.findOne(commentId);
    const removedIndex = commentToRemove.index;
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(EComment)
      .where('id = :id', { id: commentId })
      .execute();

    await this.commentRepository
      .createQueryBuilder()
      .update('comment')
      .set({ index: () => 'index - 1' })
      .where('index >= :id', { id: removedIndex })
      .execute();
  }

  async modifyComment(
    commentId: string,
    updatedComment: IComment
  ): Promise<EComment> {
    const oldComment = await this.commentRepository.findOne(commentId);

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
