import React from 'react';
import { TextField, Button } from '@material-ui/core';
import CenteredForm from 'elements/CenteredForm';
import FormButtonContainer from 'elements/FormButtonContainer';

import Select from 'elements/Select';

import { isNotFilledOut, isTooLong, trimState } from 'utils/index';

import { useForm } from 'hooks/form';

const CreateUserPage = (): JSX.Element => {
  const initialState = {
    email: '',
    password: '',
    confirmPassword: '',
    role: 2,
  };

  // Fix Roles to be drawn from types
  const userRoles = [
    { label: 'Boss', value: 0 },
    { label: 'Middler', value: 1 },
    { label: 'Grunt', value: 2 },
  ];

  const { state, submit, reset, errors, triedSubmit, dispatch } = useForm({
    initialState,
    reducer: (state, action) => {
      const { payload, type } = action;

      const newState = { ...state };
      if (type === 'setEmail') {
        newState.email = payload;
      } else if (type === 'setPassword') {
        newState.password = payload;
      } else if (type === 'setConfirmPassword') {
        newState.confirmPassword = payload;
      } else if (type === 'setRole') {
        newState.role = payload;
      }
      return newState;
    },
    validateState: state => {
      const errors: Record<string, string> = {};
      const vState = { ...state };

      trimState(vState);

      if (isNotFilledOut(vState.email)) {
        errors.email = 'An email must be provided.';
      }
      if (isTooLong(vState.email, 120)) {
        errors.email = 'An email must be less than 120 characters.';
      }
      if (isNotFilledOut(vState.password)) {
        errors.password = 'A password must be provided.';
      }
      if (isTooLong(vState.password, 120)) {
        errors.password = 'A password must be less than 120 characters.';
      }
      return Object.keys(errors).length ? errors : undefined;
    },
    onSubmit: async state => {
      console.log('Here is a submission');
      // const sessionToken = await login(state.email, state.password);
      // if (sessionToken) {
      //   setSessionToken(sessionToken);
      //   window.location.href = '/';
      // } else {
      //   console.error('failed to login');
      // }
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      submit();
    }
  };

  return (
    <CenteredForm>
      <div>
        <TextField
          variant="outlined"
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={state.email}
          onChange={e => {
            dispatch({ type: 'setEmail', payload: e.target.value });
          }}
          onKeyDown={handleKeyDown}
        />
        <TextField
          variant="outlined"
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={state.password}
          onChange={e => {
            dispatch({ type: 'setPassword', payload: e.target.value });
          }}
          onKeyDown={handleKeyDown}
        />
        <TextField
          variant="outlined"
          margin="dense"
          label="Confirm Password"
          type="password"
          fullWidth
          value={state.confirmPassword}
          onChange={e => {
            dispatch({ type: 'setConfirmPassword', payload: e.target.value });
          }}
          onKeyDown={handleKeyDown}
        />
        <Select
          onChange={e => {
            dispatch({ type: 'setRole', payload: e.target.value });
          }}
          value={state.role}
          title="User Role"
          items={userRoles}
        ></Select>
        <FormButtonContainer>
          <Button
            fullWidth
            variant="contained"
            onClick={() => submit()}
            color="primary"
          >
            Log In
          </Button>
        </FormButtonContainer>
      </div>
    </CenteredForm>
  );
};

export default CreateUserPage;
