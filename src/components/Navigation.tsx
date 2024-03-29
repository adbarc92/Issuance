import React from 'react';
import clsx from 'clsx';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  IconButton,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  ListItem,
  styled,
  Badge,
} from '@material-ui/core';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Apps as ProjectsIcon,
  FormatListNumbered as TasksIcon,
  People as PersonnelIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  ExitToApp as LogoutIcon,
} from '@material-ui/icons';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import SearchInput from 'elements/SearchInput';
import Root from 'elements/Root';
import { getPersonName, makeGreeting } from 'utils/index';
import { Person } from 'types/person';
import { ClientUser } from 'types/user';
import { Greetings } from 'types/navigation';

import { markNotificationsAsViewed } from 'store/actions';

import theme from 'theme';

import NotificationPopover from 'components/NotificationPopover';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    searchfieldContainer: {
      justifyContent: 'right',
      borderRadius: theme.shape.borderRadius,
      width: '250px',
      height: '32px',
      backgroundColor: '#191970',
    },
    title: {
      flexGrow: 1,
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // * Necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
  });
});

export interface NotificationPanelProps {
  hidden: boolean;
}

const NotificationIconContainer = styled('div')(() => {
  return {
    marginRight: '2rem',
    color: theme.palette.primary.contrastText,
  };
});

interface NavigationProps {
  person: Person;
  user: ClientUser;
}

const Navigation = (props: NavigationProps): JSX.Element => {
  const { person, user } = props;

  const { notifications } = user;

  const unviewedNotifications = notifications.filter(notification => {
    return !notification.viewed;
  });

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [inputString, setInputString] = React.useState<string>('');

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const [greeting, setGreeting] = React.useState<Greetings>(makeGreeting());

  const handleShowPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    markNotificationsAsViewed(unviewedNotifications);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Root>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {`${greeting} ${getPersonName(person)}!`}
          </Typography>
          <NotificationIconContainer>
            <IconButton color="inherit" onClick={handleShowPopover}>
              <Badge
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={unviewedNotifications.length}
                color="secondary"
              >
                <NotificationsActiveIcon />
              </Badge>
            </IconButton>
            <NotificationPopover
              notifications={unviewedNotifications}
              anchorEl={anchorEl}
              handleClosePopover={handleClosePopover}
            />
          </NotificationIconContainer>

          <div className={classes.searchfieldContainer}>
            <SearchInput
              placeholder={'Search...'}
              value={inputString}
              onChange={e => {
                const val = (e as any).target.value;
                setInputString(val);
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key={'Home'}>
            <Link to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
            </Link>
            <Link to="/">
              <ListItemText primary={'Home'} />
            </Link>
          </ListItem>
          <ListItem button key={'Projects'}>
            <Link to="/projects">
              <ListItemIcon>
                <ProjectsIcon />
              </ListItemIcon>
            </Link>
            <Link to="/projects">
              <ListItemText primary={'Projects'} />
            </Link>
          </ListItem>
          <ListItem button key={'Tasks'}>
            <Link to="/tasks">
              <ListItemIcon>
                <TasksIcon />
              </ListItemIcon>
            </Link>
            <Link to="/tasks">
              <ListItemText primary={'Tasks'} />
            </Link>
          </ListItem>
          <ListItem button key={'Personnel'}>
            <Link to="/personnel">
              <ListItemIcon>
                <PersonnelIcon />
              </ListItemIcon>
            </Link>
            <Link to="/personnel">
              <ListItemText primary={'Personnel'} />
            </Link>
          </ListItem>
          <ListItem button key={'Notifications Feed'}>
            <Link to="/notifications">
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
            </Link>
            <Link to="/notifications">
              <ListItemText primary={'Notifications Feed'} />
            </Link>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button key={'Settings'}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={'Settings'} />
          </ListItem>
          <ListItem button key={'Log Out'}>
            <Link to="/logout">
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
            </Link>
            <Link to="/logout">
              <ListItemText primary={'Log Out'} />
            </Link>
          </ListItem>
        </List>
      </Drawer>
    </Root>
  );
};

export default Navigation;
