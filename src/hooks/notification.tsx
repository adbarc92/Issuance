import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// * This returns a JSX element that is then rendered
// * This should also return a function that shows/opens the JSX Element

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export enum NotificationSeverity {
  SUCCESS,
  ERROR,
}

export const useNotificationSnackbar = (
  position?: 'top' | 'bottom'
): [JSX.Element, (message: string, severity: NotificationSeverity) => void] => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState<NotificationSeverity>(
    NotificationSeverity.SUCCESS
  );

  let vertical: 'top' | 'bottom' = 'bottom';
  const horizontal = 'center';

  if (position === 'top') {
    vertical = 'top';
  }

  const handleClose = () => {
    setOpen(false);
  };

  const snackbar = (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={
          severity === NotificationSeverity.SUCCESS ? 'success' : 'error'
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );

  return [
    snackbar,
    (message: string, severity: NotificationSeverity) => {
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
    },
  ];
};
