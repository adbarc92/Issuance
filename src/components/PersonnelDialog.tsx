import React, { useEffect } from 'react';

import Select from 'elements/Select';
import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'hooks/notification';

import { styled } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import { createPerson, updatePerson } from 'store/actions';
import { Person, PersonJob } from 'types/person';

import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';

import { useForm } from 'hooks/form';

import {
  isEmailValid,
  isNotFilledOut,
  trimState,
  isTooLong,
} from 'utils/index';

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: () => void;
  clearPersonnelCache: () => void;
  person: Person | null;
}

const SelectWrapper = styled('div')(() => {
  return {
    marginTop: '1rem',
    width: '50%',
  };
});

const PersonJobMap = {
  [PersonJob.UI]: {
    label: 'UI',
  },
  [PersonJob.QA]: {
    label: 'QA',
  },
  [PersonJob.CODER]: {
    label: 'Coder',
  },
  [PersonJob.MANAGER]: {
    label: 'Manager',
  },
};

export interface IPersonnelDialogActions {
  type: string;
  payload?: any;
}

export interface PersonnelDialogState {
  id?: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  job: PersonJob;
}

export enum PersonnelDialogAction {
  SET_FIRST_NAME = 'setFirstName',
  SET_LAST_NAME = 'setLastName',
  SET_CONTACT_EMAIL = 'setContactEmail',
  SET_JOB = 'setJob',
}

function PersonnelDialog(props: SimpleDialogProps): JSX.Element {
  const { person, onClose, open, clearPersonnelCache } = props;

  const [curPerson, setCurPerson] = React.useState(person);

  const addingPerson = person ? false : true; // If a person is passed in, it is being edited

  console.log('Dialog Person:', person);

  const initialState: PersonnelDialogState = person
    ? {
        id: person.id,
        firstName: person.firstName ?? '',
        lastName: person.lastName ?? '',
        userEmail: person.userEmail,
        job: person.job,
      }
    : {
        firstName: '',
        lastName: '',
        userEmail: '',
        job: PersonJob.CODER,
      };

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
      state: PersonnelDialogState,
      action: IPersonnelDialogActions
    ): PersonnelDialogState => {
      const { payload, type } = action;
      const newState = { ...state };
      if (type === 'setFirstName') {
        newState.firstName = payload;
      } else if (type === 'setLastName') {
        newState.lastName = payload;
      } else if (type === 'setContactEmail') {
        newState.userEmail = payload;
      } else if (type === 'setJob') {
        newState.job = payload;
      }
      return newState;
    },
    validateState: (
      state: PersonnelDialogState
    ): undefined | Record<string, string> => {
      const errors: Record<string, string> = {};
      const vState = { ...state };

      trimState(vState);

      if (isNotFilledOut(vState.userEmail)) {
        errors.userEmail = 'An email address must be provided';
      }
      if (!isEmailValid(vState.userEmail)) {
        errors.userEmail = 'A valid email address must be provided';
      }
      if (isTooLong(vState.firstName, 40)) {
        errors.firstName = 'A first name cannot be longer than 40 characters';
      }
      if (isTooLong(vState.lastName, 40)) {
        errors.firstName = 'A last name cannot be longer than 40 characters';
      }
      return Object.keys(errors).length ? errors : undefined;
    },
    onSubmit: async state => {
      if (errors) {
      }

      const { userEmail, firstName, lastName, job } = state;

      const newPerson = await (addingPerson
        ? createPerson({
            userEmail,
            firstName,
            lastName,
            job,
          })
        : updatePerson({
            id: state.id as string,
            userEmail,
            firstName,
            lastName,
            job,
          }));

      if (newPerson) {
        showNotification(
          'User created successfully!',
          NotificationSeverity.SUCCESS
        );
        onClose();
        clearPersonnelCache(); // calls a setState on the hook
      } else {
        showNotification('User creation failed!', NotificationSeverity.ERROR);
      }
    },
  });

  useEffect(() => {
    if (person !== curPerson) {
      setCurPerson(person);
      reset();
    }
  }, [person, curPerson, reset]);

  const [snackbar, showNotification] = useNotificationSnackbar();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      {snackbar}
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="form-dialog-title">
          {addingPerson ? 'Add Person' : 'Edit Person'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {addingPerson
              ? 'Add personnel to application'
              : 'Edit application personnel'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="User Email"
            type="email"
            fullWidth
            value={state.userEmail}
            onChange={e => {
              dispatch({
                type: PersonnelDialogAction.SET_CONTACT_EMAIL,
                payload: e.target.value,
              });
            }}
          />
          <TextField
            margin="dense"
            id="first-name"
            label="First Name"
            type="text"
            fullWidth
            value={state.firstName}
            onChange={e => {
              dispatch({
                type: PersonnelDialogAction.SET_FIRST_NAME,
                payload: e.target.value,
              });
            }}
          />
          <TextField
            margin="dense"
            id="last-name"
            label="Last Name"
            type="text"
            fullWidth
            value={state.lastName}
            onChange={e => {
              dispatch({
                type: PersonnelDialogAction.SET_LAST_NAME,
                payload: e.target.value,
              });
            }}
          />
          <SelectWrapper>
            <Select
              title="Job"
              fullWidth
              items={Object.keys(PersonJobMap).map(key => {
                return {
                  label: PersonJobMap[key].label,
                  value: key,
                };
              })}
              value={state.job}
              onChange={e => {
                dispatch({
                  type: PersonnelDialogAction.SET_JOB,
                  payload: e.target.value,
                });
              }}
            />
          </SelectWrapper>
        </DialogContent>
        {triedSubmit && errors ? (
          <DialogContent>
            {Object.values(errors).map((errorMessage, index) => {
              return (
                <Alert severity="error" key={index}>
                  {errorMessage}
                </Alert>
              );
            })}
          </DialogContent>
        ) : null}
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button disabled={pristine} onClick={() => submit()} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PersonnelDialog;
