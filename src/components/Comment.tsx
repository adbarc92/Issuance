import React from 'react';

import { Link } from 'react-router-dom';

import { ClientComment } from 'types/comment';

import { styled } from '@material-ui/core';

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

  const { profilePicture, firstName, lastName, id, userEmail } = commenter;

  const displayName = firstName && lastName ? `/personnel/${id}` : userEmail;

  return (
    <CommentContainer>
      {/* <img alt={'Person'}>{profilePicture ?? ''}</img> */}
      <div>
        <div>
          <Link to={`/personnel/${id}`}>
            <div>{displayName}</div>
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
