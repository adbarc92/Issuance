import React from 'react';

import { styled, TextField } from '@material-ui/core';

import { Button } from '@material-ui/core';

const CenteredForm = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
  };
});

const ButtonContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
  };
});

const WideDiv = styled('div')(() => {
  return {
    width: '25rem',
  };
});

const loginReducer = (state, action) => {
  const { payload, type } = action;
  const newState = { ...state };
  if (type === 'setEmail') {
    newState.email = payload;
  } else if (type === 'setPassword') {
    newState.password = payload;
  }
  return newState;
};

const LoginPage = (): JSX.Element => {
  const [state, dispatch] = React.useReducer(loginReducer, {
    email: '',
    password: '',
  });

  const submit = () => {
    console.log('Login');
  };

  return (
    <CenteredForm>
      <WideDiv>
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={state.email}
          onChange={e => {
            dispatch({ type: 'setEmail', payload: e.target.value });
          }}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={state.password}
          onChange={e => {
            dispatch({ type: 'setPassword', payload: e.target.value });
          }}
        />
        <ButtonContainer>
          <Button variant="contained" onClick={() => submit()} color="primary">
            Login
          </Button>
        </ButtonContainer>
      </WideDiv>
    </CenteredForm>
  );
};

export default LoginPage;
