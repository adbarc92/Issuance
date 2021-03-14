import React from 'react';

import { Link } from 'react-router-dom';

import { Comment as IComment } from 'types/comment';

import { styled } from '@material-ui/core';

export interface CommentProps {
  comment: IComment;
}

const CommentContainer = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
  };
});

const Comment = (props: CommentProps): JSX.Element => {
  const { commenter, content, createdAt } = props.comment;

  const { profilePicture, firstName, lastName, id } = commenter;
  return (
    <CommentContainer>
      <img alt={'Person'}>{profilePicture ?? ''}</img>
      <div>
        <div>
          <Link to={`/personnel/${id}`}>
            <div>{firstName + lastName}</div>
          </Link>
          <div>{createdAt}</div>
        </div>
        <div>{content}</div>
      </div>
    </CommentContainer>
  );
};

export default Comment;
