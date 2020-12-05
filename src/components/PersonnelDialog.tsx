import React from 'react';

import UserSelect from 'elements/UserSelect';
import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'store/useNotification';

import { createPerson } from 'store/axiosHooks';
import { PersonRole } from 'types/person';

import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: () => void;
  clearPersonnelCache: () => void;
}

function PersonnelDialog(props: SimpleDialogProps): JSX.Element {
  const { onClose, selectedValue, open, clearPersonnelCache } = props;

  const [newPersonName, setNewPersonName] = React.useState('');
  const [newPersonEmail, setNewPersonEmail] = React.useState('');
  const [newPersonRole, setNewPersonRole] = React.useState<PersonRole>(
    PersonRole.MIDDLER
  );

  const [snackbar, showNotification] = useNotificationSnackbar();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    const person = await createPerson(
      newPersonName,
      newPersonEmail,
      newPersonRole
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
            label="Name"
            type="text"
            fullWidth
            value={newPersonName}
            onChange={e => {
              setNewPersonName(e.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={newPersonEmail}
            onChange={e => {
              setNewPersonEmail(e.target.value);
            }}
          />
          <UserSelect
            value={newPersonRole}
            onChange={e => {
              setNewPersonRole(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PersonnelDialog;
