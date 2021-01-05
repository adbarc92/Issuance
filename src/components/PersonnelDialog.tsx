import React from 'react';

import Select from 'elements/Select';
import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'hooks/notification';

import { styled } from '@material-ui/core';

import { createPerson } from 'hooks/axiosHooks';
import { PersonJob } from 'types/person';

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

import { isNotFilledOut, trimState } from 'utils/index';

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: () => void;
  clearPersonnelCache: () => void;
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
  firstName: string;
  lastName: string;
  contactEmail: string;
  job: PersonJob.CODER;
}

export enum PersonnelDialogAction {
  SET_FIRST_NAME = 'setFirstName',
  SET_LAST_NAME = 'setLastName',
  SET_CONTACT_EMAIL = 'setContactEmail',
  SET_JOB = 'setJob',
}

function PersonnelDialog(props: SimpleDialogProps): JSX.Element {
  const { onClose, open, clearPersonnelCache } = props;
  const initialState: PersonnelDialogState = {
    firstName: '',
    lastName: '',
    contactEmail: '',
    job: PersonJob.CODER,
  };

  const { state, submit, dispatch } = useForm({
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
        newState.contactEmail = payload;
      } else if (type === 'setJob') {
        newState.job = payload;
      }
      return newState;
    },
    validateState: state => {
      const errors: Record<string, string> = {};
      const vState = { ...state };

      trimState(vState);

      if (isNotFilledOut(vState.firstName)) {
        errors.firstName = 'A first name must be provided.';
      }
      return Object.keys(errors).length ? errors : undefined;
    },
    onSubmit: async state => {
      const person = await createPerson(
        state.firstName,
        state.lastName,
        state.contactEmail,
        state.job
      );
      if (person) {
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

  const [snackbar, showNotification] = useNotificationSnackbar();

  const handleClose = () => {
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
        <DialogTitle id="form-dialog-title">Add User</DialogTitle>
        <DialogContent>
          <DialogContentText>Add user to application.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
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
            id="name"
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
          <TextField
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={state.contactEmail}
            onChange={e => {
              dispatch({
                type: PersonnelDialogAction.SET_CONTACT_EMAIL,
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
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => submit()} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PersonnelDialog;
