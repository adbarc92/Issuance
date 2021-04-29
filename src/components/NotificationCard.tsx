import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ClientNotification } from 'types/notification';

import { UpdateItemTypes, UpdateItemActions } from 'types/updateItem';

import { formatDate } from 'utils';

export interface NotificationCardProps {
  notification: ClientNotification;
  key: number;
}

const createNotificationLink = (text: string, url: string): JSX.Element => {
  return <Link to={url}>{text}</Link>;
};

const composeCardContent = (notification: ClientNotification) => {
  const {
    changerId,
    changerName,
    actionType,
    itemId,
    itemName,
    itemType,
  } = notification;

  const userLink = `personnel/${changerId}`;

  const itemLink =
    itemType === UpdateItemTypes.PROJECT
      ? `projects/${itemId}`
      : `tasks/${itemId}`;

  if (itemType === UpdateItemTypes.PROJECT) {
    if (actionType === UpdateItemActions.CREATE) {
      return (
        <Typography>
          User {createNotificationLink(changerName, userLink)} created a new
          project, {createNotificationLink(itemName, itemLink)}
        </Typography>
      );
    } else if (actionType === UpdateItemActions.UPDATE) {
      return (
        <Typography>
          User {createNotificationLink(changerName, userLink)} updated a
          project, {createNotificationLink(itemName, itemLink)}
        </Typography>
      );
    } else if (actionType === UpdateItemActions.DELETE) {
      return (
        <Typography>
          User {createNotificationLink(changerName, userLink)} deleted a
          project, {createNotificationLink(itemName, itemLink)}
        </Typography>
      );
    }
  } else {
    if (itemType === UpdateItemTypes.COMMENT) {
      if (actionType === UpdateItemActions.CREATE) {
        return (
          <Typography>
            User {createNotificationLink(changerName, userLink)} commented on
            task, {createNotificationLink(itemName, itemLink)}
          </Typography>
        );
      } else if (actionType === UpdateItemActions.UPDATE) {
        return (
          <Typography>
            User {createNotificationLink(changerName, userLink)} modified their
            comment on task, {createNotificationLink(itemName, itemLink)}
          </Typography>
        );
      } else if (actionType === UpdateItemActions.DELETE) {
        return (
          <Typography>
            User {createNotificationLink(changerName, userLink)} deleted their
            comment on task, {createNotificationLink(itemName, itemLink)}
          </Typography>
        );
      }
    } else if (itemType === UpdateItemTypes.TASK) {
      if (actionType === UpdateItemActions.CREATE) {
        return (
          <Typography>
            User {createNotificationLink(changerName, userLink)} created a new
            task {createNotificationLink(itemName, itemLink)} assigned to you
          </Typography>
        );
      } else if (actionType === UpdateItemActions.UPDATE) {
        return (
          <Typography>
            User {createNotificationLink(changerName, userLink)} modified a task{' '}
            {createNotificationLink(itemName, itemLink)} assigned to you
          </Typography>
        );
      } else if (actionType === UpdateItemActions.DELETE) {
        return (
          <Typography>
            User {createNotificationLink(changerName, userLink)} deleted a task{' '}
            {createNotificationLink(itemName, itemLink)} assigned to you
          </Typography>
        );
      }
    }
  }
};

const NotificationCard = (props: NotificationCardProps): JSX.Element => {
  const { notification, key } = props;

  const { changeMadeAt } = notification;

  const d = new Date(changeMadeAt);

  return (
    <Card key={key}>
      <CardContent>
        {composeCardContent(notification)}
        <Typography>{formatDate(d)}</Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
