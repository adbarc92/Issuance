// Todo: add profile picture to comment

import React from 'react';
import { Link } from 'react-router-dom';
import { ClientComment } from 'types/comment';
import { styled } from '@material-ui/core';
import { getPersonName } from 'utils';

export interface CommentProps {
  comment: ClientComment;
}

const CommentContainer = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
  };
});

const Comment = (props: CommentProps): JSX.Element => {
  const { commenter, content, createdAt } = props.comment;

  const { id } = commenter;

  const displayName = getPersonName(commenter);

  return (
    <CommentContainer>
      <div>
        <div>
          <Link to={`/personnel/${id}`}>
            <div>{displayName ?? `User ${id}`}</div>
          </Link>
          <div>{createdAt}</div>
        </div>
        <div>{content}</div>
      </div>
    </CommentContainer>
  );
};

export interface CommentsProps {
  comments: ClientComment[];
}

const Comments = (props: CommentsProps): JSX.Element => {
  const { comments } = props;

  const [commentState] = React.useState(comments);

  return (
    <>
      {commentState.map((comment, index) => {
        return <Comment key={index} comment={comment} />;
      })}
    </>
  );
};

export default Comments;
