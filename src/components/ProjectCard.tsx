// Todo: Test aria properties

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Collapse,
  List,
  ListItem,
  ListItemText,
  IconButton,
  styled,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

import clsx from 'clsx';

import { ClientTask } from 'types/task';
import { ClientProject } from 'types/project';

import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

interface ProjectCardProps {
  project: ClientProject;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
  })
);

const CustomCard = styled(Card)(() => {
  return {
    maxWidth: '350px',
    margin: '1rem',
  };
});

const ProjectCard = (props: ProjectCardProps): JSX.Element => {
  const { project } = props;

  const { tasks } = project;

  const [expanded, setExpanded] = React.useState(false);

  const classes = useStyles();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const displayTasks = (tasks: ClientTask[]): JSX.Element => {
    return (
      <List>
        {tasks.map((task, index) => {
          return (
            <ListItem key={index}>
              <Link to={`/tasks/${task.id}`}>
                <ListItemText>
                  {task.name}:
                  {task.description.length > 40
                    ? task.description.slice(0, 40)
                    : task.description}
                </ListItemText>
              </Link>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <CustomCard>
      <Link to={`/projects/${project.id}`}>
        <CardHeader
          title={
            project.title.length > 15
              ? project.title.slice(0, 15)
              : project.title
          }
          subheader={project.deadline}
        />
      </Link>
      <CardContent>
        <Typography>{project.description}</Typography>
      </CardContent>
      <CardActions>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto">
        <CardContent>
          <Typography>Task Preview:</Typography>
          {tasks && tasks.length ? (
            displayTasks(tasks)
          ) : (
            <Typography>This project has no tasks!</Typography>
          )}
        </CardContent>
      </Collapse>
    </CustomCard>
  );
};

export default ProjectCard;
