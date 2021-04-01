// Todo: implement `size` based on Theme

import React from 'react';
import { Avatar as MuiAvatar } from '@material-ui/core';

// * Should be an Image if it exists, a letter avatar if not and first/last name are declared, and a generic icon if neither

interface AvatarProps {
  imgSrc?: string;
  firstName?: string;
  lastName?: string;
  size?: 'large' | 'medium' | 'small';
  username: string;
}

const Avatar = (props: AvatarProps): JSX.Element => {
  const { imgSrc, firstName, lastName, username } = props;

  let alt: string, letters: string | undefined;

  if (firstName && lastName) {
    alt = `${firstName} ${lastName}`;
    letters = firstName.slice(0, 1) + lastName.slice(0, 1);
  } else if (firstName || lastName) {
    alt = (firstName as string) || (lastName as string);
    letters = (firstName || lastName)?.slice(0, 1);
  } else {
    alt = username;
  }

  return (
    <MuiAvatar src={imgSrc} alt={alt}>
      {letters}
    </MuiAvatar>
  );
};

export default Avatar;
