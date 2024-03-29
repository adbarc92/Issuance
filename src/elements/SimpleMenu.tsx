import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';

interface MenuItem {
  key: string;
  onClick: () => void;
}

interface SimpleMenuProps {
  anchorElement: HTMLElement | null;
  menuItems: MenuItem[];
  handleClose: () => void;
}

function SimpleMenu(props: SimpleMenuProps): JSX.Element {
  const { anchorElement, menuItems, handleClose } = props;
  return (
    <Menu
      anchorEl={anchorElement}
      onClose={handleClose}
      keepMounted
      open={Boolean(anchorElement)}
    >
      {menuItems &&
        menuItems.map((item, index) => {
          return (
            <MenuItem onClick={item.onClick} key={index}>
              {item.key}
            </MenuItem>
          );
        })}
    </Menu>
  );
}

export default SimpleMenu;
