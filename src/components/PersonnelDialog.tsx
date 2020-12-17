import React from 'react';

// import UserSelect from 'elements/UserSelect';
import Select from 'elements/Select';
import { mapEnumToSelectItems } from 'utils';
import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'hooks/notification';

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
  const [newPersonJob, setNewPersonJob] = React.useState<PersonJob>(
    PersonJob.CODER
  );

  const [snackbar, showNotification] = useNotificationSnackbar();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    const person = await createPerson(
      newPersonName,
      newPersonEmail,
      newPersonJob
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
          <Select
            title="Job"
            items={mapEnumToSelectItems(PersonJob)}
            value={newPersonJob}
            onChange={e => {
              setNewPersonJob(e.target.value);
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
