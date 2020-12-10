import React from 'react';

import { styled, TextField } from '@material-ui/core';

import { Button } from '@material-ui/core';

import { isNotFilledOut, isTooLong, trimState } from 'utils/index';

import { login } from 'store/actions';

import { useForm } from 'hooks/form';

import ErrorBox from 'elements/ErrorBox';
import { setSessionToken } from 'store/auth';

const CenteredForm = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    position: 'fixed',
    paddingTop: '10rem',
  };
});

const ButtonContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '0.5rem',
  };
});

const WideDiv = styled('div')(() => {
  return {
    width: '25rem',
  };
});

const ErrorBoxWrapper = styled('div')(() => {
  return {
    marginTop: '1rem',
  };
});

const LoginPage = (): JSX.Element => {
  const initialState = {
    email: '',
    password: '',
  };

  const { state, submit, reset, errors, triedSubmit, dispatch } = useForm({
    initialState,
    reducer: (state, action) => {
      const { payload, type } = action;

      const newState = { ...state };
      if (type === 'setEmail') {
        newState.email = payload;
      } else if (type === 'setPassword') {
        newState.password = payload;
      }
      return newState;
    },
    validateState: state => {
      const errors: Record<string, string> = {};
      const vState = { ...state };
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
      const sessionToken = await login(state.email, state.password);
      if (sessionToken) {
        setSessionToken(sessionToken);
        window.location.href = '/';
      } else {
        console.error('failed to login');
      }
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      submit();
    }
  };

  return (
    <CenteredForm>
      <WideDiv>
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
        <ButtonContainer>
          <Button
            fullWidth
            variant="contained"
            onClick={() => submit()}
            color="primary"
          >
            Log In
          </Button>
        </ButtonContainer>
        {errors && triedSubmit ? (
          <ErrorBoxWrapper>
            <ErrorBox errors={errors} />
          </ErrorBoxWrapper>
        ) : null}
      </WideDiv>
    </CenteredForm>
  );
};

export default LoginPage;
