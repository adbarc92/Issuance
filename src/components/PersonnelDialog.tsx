import React from 'react';

import UserSelect from 'elements/UserSelect';
import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'store/useNotification';

import { createUser } from 'store/axiosHooks';
import { PersonnelRole } from 'types/personnel';

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
  clearUsersCache: () => void;
}

function PersonnelDialog(props: SimpleDialogProps): JSX.Element {
  const { onClose, selectedValue, open, clearUsersCache } = props;

  const [newPersonnelName, setNewPersonnelName] = React.useState('');
  const [newPersonnelEmail, setNewPersonnelEmail] = React.useState('');
  const [newPersonnelRole, setNewPersonnelRole] = React.useState<PersonnelRole>(
    PersonnelRole.MIDDLER
  );

  const [snackbar, showNotification] = useNotificationSnackbar();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    const personnel = await createUser(
      newPersonnelName,
      newPersonnelEmail,
      newPersonnelRole
    );
    if (personnel) {
      showNotification(
        'User created successfully!',
        NotificationSeverity.SUCCESS
      );
      onClose();
      clearUsersCache(); // calls a setState on the hook
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
            label="User Name"
            type="text"
            fullWidth
            value={newPersonnelName}
            onChange={e => {
              setNewPersonnelName(e.target.value);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={newPersonnelEmail}
            onChange={e => {
              setNewPersonnelEmail(e.target.value);
            }}
          />
          <UserSelect
            value={newPersonnelRole}
            onChange={e => {
              setNewPersonnelRole(e.target.value);
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
