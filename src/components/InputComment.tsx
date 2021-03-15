// Todo: test, fix error message display

import React from 'react';
import { TextField, Button } from '@material-ui/core';

import { useForm, FormAction } from 'hooks/form';
import { createComment } from 'store/actions';

import { isNotFilledOut, trimState, isTooLong } from 'utils/index';

import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'hooks/notification';

import { InputComment } from 'types/comment';

import { reRenderApp } from 'App';

export enum InputCommentAction {
  SET_CONTENT = 'setContent',
}

export interface InputCommentState {
  content: string;
}

export interface InputCommentProps {
  headerCommentId?: string;
  taskId: string;
}

const InputComment = (props: InputCommentProps): JSX.Element => {
  const initialState = {
    content: '',
  };

  const [snackbar, showNotification] = useNotificationSnackbar();

  const {
    state,
    submit,
    reset,
    errors,
    triedSubmit,
    dispatch,
    pristine,
  } = useForm({
    initialState,
    reducer: (
      state: InputCommentState,
      action: FormAction
    ): InputCommentState => {
      const { payload, type } = action;
      const newState = { ...state };

      if (type === 'setContent') {
        newState.content = payload;
      }
      return newState;
    },
    validateState: (
      state: InputCommentState
    ): undefined | Record<string, string> => {
      const errors: Record<string, string> = {};
      const vState = { ...state };

      trimState(vState);

      if (isNotFilledOut(vState.content)) {
        errors.content = 'A comment is required to submit a comment.';
      }
      if (isTooLong(vState.content, 400)) {
        errors.content = 'A comment cannot be more than 400 characters.';
      }
      return Object.keys(errors).length ? errors : undefined;
    },
    onSubmit: async state => {
      if (errors) {
        showNotification(
          "User doesn't meet requirements.",
          NotificationSeverity.ERROR
        );
        return;
      }

      trimState(state);

      // Get CommenterId here

      const commentToSubmit: InputComment = {
        headerCommentId: props.headerCommentId ?? null,
        commenterId: '',
        content: state.content,
        taskId: props.taskId,
      };

      const commentResponse = await createComment(commentToSubmit);

      if (commentResponse) {
        showNotification(
          'Comment created successfully!',
          NotificationSeverity.SUCCESS
        );
      } else {
        showNotification(
          `Comment creation failed!`,
          NotificationSeverity.ERROR
        );
      }
    },
  });

  return (
    <div>
      <TextField
        variant="outlined"
        required
        multiline
        value={state.content}
        onChange={e => {
          dispatch({
            type: InputCommentAction.SET_CONTENT,
            payload: e.target.value,
          });
        }}
      />
      <Button
        variant="contained"
        onClick={submit}
        disabled={pristine}
        color="primary"
      >
        Submit
      </Button>

      {triedSubmit && errors
        ? Object.values(errors).map((errorMessage, index) => {
            return <div key={index}>{errorMessage}</div>;
          })
        : null}
    </div>
  );
};

export default InputComment;
