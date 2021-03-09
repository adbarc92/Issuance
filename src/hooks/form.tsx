import React from 'react';

// Hook should return: current state, function to submit, function to reset, current list of errors, submission status, dispatch

// Requires: initialState, reducer, validation function,

export interface FormAction {
  type: string;
  payload?: any;
}

// Generalized for state of type T
export interface FormProps<T> {
  initialState: T;
  reducer: (state: T, action: FormAction) => T;
  validateState: (state: T) => undefined | Record<string, string>;
  onSubmit: (state: T) => void;
}

export interface FormReturn<T> {
  state: T;
  submit: () => void;
  reset: () => void;
  errors: Record<string, string> | undefined;
  triedSubmit: boolean;
  dispatch: (action: FormAction) => void;
}

export const useForm = function <T>(props: FormProps<T>): FormReturn<T> {
  const [errors, setErrors] = React.useState<
    Record<string, string> | undefined
  >(undefined);

  const [triedSubmit, setTriedSubmit] = React.useState(false);

  const [state, dispatch] = React.useReducer((state: T, action: FormAction) => {
    if (action.type === 'RESET') {
      return props.initialState;
    } else {
      const newState = props.reducer(state, action);
      const errors = props.validateState(newState);
      setErrors(errors);
      return newState;
    }
  }, props.initialState);

  const reset = () => {
    dispatch({ type: 'RESET' });
    setTriedSubmit(false);
    setErrors(undefined);
  };

  const submit = () => {
    setTriedSubmit(true);
    if (props.validateState(state)) {
      return;
    }
    props.onSubmit(state);
  };

  return {
    state,
    submit,
    reset,
    errors,
    triedSubmit,
    dispatch,
  };
};
