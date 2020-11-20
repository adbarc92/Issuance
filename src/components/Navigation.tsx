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
} from '@material-ui/core';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Apps as ProjectsIcon,
  FormatListNumbered as TasksIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from '@material-ui/icons';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import SearchInput from 'elements/SearchInput';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
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
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
  })
);

const Navigation = (): JSX.Element => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [inputString, setInputString] = React.useState<string>('');
  const [searchString, setSearchString] = React.useState<string>('');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
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
            Hello, User!
          </Typography>
          <div className={classes.searchfieldContainer}>
            <SearchInput
              placeholder={'Search...'}
              value={inputString}
              onChange={e => {
                const val = (e as any).target.value;
                setInputString(val);
                setSearchString(val);
              }}
            ></SearchInput>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        // Question: Classes?
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
            <ListItemIcon>
              <ProjectsIcon />
            </ListItemIcon>
            <ListItemText primary={'Projects'} />
          </ListItem>
          <ListItem button key={'Tasks'}>
            <Link to="/tasks">
              <ListItemIcon>
                <UsersIcon />
              </ListItemIcon>
            </Link>
            <Link to="/tasks">
              <ListItemText primary={'Tasks'} />
            </Link>
          </ListItem>
          <ListItem button key={'Users'}>
            <Link to="/users">
              <ListItemIcon>
                <UsersIcon />
              </ListItemIcon>
            </Link>
            <Link to="/users">
              <ListItemText primary={'Users'} />
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
          <ListItem button key={'Search'}>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary={'Search'} />
          </ListItem>
          <ListItem button key={'Notifications'}>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary={'Notifications'} />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default Navigation;
