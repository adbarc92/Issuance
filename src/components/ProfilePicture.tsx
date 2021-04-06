// Todo: implement `size`/spacing based on Theme;
// Todo: REFACTOR to be less garbage

import React from 'react';
import { Avatar as MuiAvatar, styled } from '@material-ui/core';

// * Should be an Image if it exists, a letter avatar if not and first/last name are declared, and a generic icon if neither

interface AvatarProps {
  imgSrc: string;
  firstName?: string;
  lastName?: string;
  size?: 'large' | 'medium' | 'small';
  username: string;
  variant?: 'circle' | 'rounded' | 'square';
}

const Avatar = (props: AvatarProps): JSX.Element => {
  const { imgSrc, firstName, lastName, username } = props;

  const variant = props.variant ?? 'rounded';

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
    <MuiAvatar variant={variant} src={imgSrc} alt={alt}>
      {letters}
    </MuiAvatar>
  );
};

const ProfilePicture = styled(Avatar)((props: any) => {
  const getSize = (size: string): number => {
    switch (size) {
      case 'large':
        return 128;
      case 'medium':
        return 64;
      case 'small':
        return 32;
      default:
        return 64;
    }
  };

  return {
    width: getSize(props.size),
    height: getSize(props.size),
  };
});

export default ProfilePicture;
