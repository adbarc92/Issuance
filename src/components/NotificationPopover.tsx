import React from 'react';
import {
  Popover as MuiPopover,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { ClientNotification } from 'types/notification';
import { createNotificationMessage } from 'utils';

import NotificationCard from 'components/NotificationCard';

export interface PopoverProps {
  notifications: ClientNotification[];
  anchorEl: HTMLButtonElement | null;
  handleClosePopover: () => void;
}

const NotificationPopover = (props: PopoverProps): JSX.Element => {
  const { notifications, anchorEl, handleClosePopover } = props;

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <MuiPopover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClosePopover}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {notifications.length ? (
        notifications.map((notification, key) =>
          NotificationCard({ notification, key })
        )
      ) : (
        <Card key={0}>
          <CardContent>
            <Typography>No new notifications!</Typography>
          </CardContent>
        </Card>
      )}
    </MuiPopover>
  );
};

export default NotificationPopover;
