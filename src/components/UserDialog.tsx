import React from 'react';

import UserSelect from 'elements/UserSelect';
import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'hooks/useNotification';

import { createUser } from 'hooks/axiosHooks';
import { UserRole } from 'types/user';

import { makeStyles } from '@material-ui/core/styles';
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';

import { blue } from '@material-ui/core/colors';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: () => void;
  clearUsersCache: () => void;
}

function UserDialog(props: SimpleDialogProps): JSX.Element {
  const classes = useStyles();
  const { onClose, selectedValue, open, clearUsersCache } = props;

  const [newUsername, setNewUsername] = React.useState('');
  const [newUserEmail, setNewUserEmail] = React.useState('');
  const [newUserRole, setNewUserRole] = React.useState<UserRole>(
    UserRole.MIDDLER
  );

  const [snackbar, showNotification] = useNotificationSnackbar();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    const user = await createUser(newUsername, newUserEmail, newUserRole);
    if (user) {
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
            value={newUsername}
            onChange={e => {
              setNewUsername(e.target.value);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={newUserEmail}
            onChange={e => {
              setNewUserEmail(e.target.value);
            }}
          />
          {/* <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Role"
          type="email"
          fullWidth
          onChange={e => {
            setNewUserRole(e.target.value);
          }}
        /> */}
          <UserSelect
            value={newUserRole}
            onChange={e => {
              setNewUserRole(e.target.value);
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

// export default function SimpleDialogDemo() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(emails[1]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = (value: string) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (
//     <div>
//       <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
//       <br />
//       <Button variant="outlined" color="primary" onClick={handleClickOpen}>
//         Open simple dialog
//       </Button>
//       <SimpleDialog
//         selectedValue={selectedValue}
//         open={open}
//         onClose={handleClose}
//       />
//     </div>
//   );
// }

export default UserDialog;
