import React from 'react';
import { TextField, Button, styled } from '@material-ui/core';
import CenteredForm from 'elements/CenteredForm';
import FormButtonContainer from 'elements/FormButtonContainer';

import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'hooks/notification';

import ErrorBox from 'elements/ErrorBox';

import { isNotFilledOut, isTooLong } from 'utils/index';

import { useForm } from 'hooks/form';
import { createUser, createPerson } from 'store/actions';

import { UserRole } from 'types/user';

import { setSessionToken } from 'store/auth';
import { login } from 'store/actions';

import { Person } from 'types/person';

// DRY-candidate
const MarginTopWrapper = styled('div')(() => {
  return {
    marginTop: '1rem',
  };
});

const CreateUserPage = (): JSX.Element => {
  const initialState = {
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.MIDDLER,
  };

  const { state, submit, errors, triedSubmit, dispatch } = useForm({
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

      // trimState(vState);

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
      if (vState.confirmPassword !== vState.password) {
        errors.confirmPassword = 'The passwords must match.';
      }
      return Object.keys(errors).length ? errors : undefined;
    },
    onSubmit: async () => {
      console.log('State:', state);
      if (errors) {
        showNotification(
          "Task doesn't meet requirements.",
          NotificationSeverity.ERROR
        );
        return;
      }

      const person = await createPerson({ username: state.email });

      const { id } = person as Person;

      if (person) {
        const userToSubmit = {
          loginEmail: state.email,
          password: state.password,
          role: state.role,
          id,
        };
        const user = await createUser(userToSubmit);
        console.log('User:', user);
        if (user) {
          const sessionToken = await login(state.email, state.password);
          if (sessionToken) {
            setSessionToken(sessionToken);
            window.location.href = '/';
          } else {
            console.error('failed to login');
          }
        } else {
          console.log('Failed to create user');
        }
      } else {
        console.log('Person could not be created');
      }

      // S/N: remove variable assignment when testing is complete

      console.log('person:', person);

      // Could use DRY
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      submit();
    }
  };

  const [snackbar, showNotification] = useNotificationSnackbar();

  return (
    <CenteredForm>
      {snackbar}
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
        <FormButtonContainer>
          <Button
            fullWidth
            variant="contained"
            onClick={() => submit()}
            color="primary"
          >
            Register
          </Button>
        </FormButtonContainer>
        {errors && triedSubmit ? (
          <MarginTopWrapper>
            <ErrorBox errors={errors} />
          </MarginTopWrapper>
        ) : null}
      </div>
    </CenteredForm>
  );
};

export default CreateUserPage;
