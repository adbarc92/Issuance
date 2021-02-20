import React from 'react';
import {
  Card,
  CardHeader,
  // CardMedia,
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

import { Person } from 'types/person';
import { Task } from 'types/task';
import { Project } from 'types/project';

import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

interface ProjectCardProps {
  project: Project;
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
  };
});

const ProjectCard = (props: ProjectCardProps): JSX.Element => {
  const { project } = props;

  const { tasks, personnel } = project;

  const [expanded, setExpanded] = React.useState(false);

  const classes = useStyles();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const displayTasks = (tasks: Task[]): JSX.Element => {
    return (
      <List>
        {tasks.map((task, index) => {
          return (
            <ListItem key={index}>
              <Link to={`/tasks/${task.id}`}>
                <ListItemText>
                  {task.name}:{' '}
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

  const displayList = (strArr: string[]): JSX.Element => {
    return (
      <List>
        {strArr.map((str, index) => {
          return (
            <ListItem key={index}>
              <ListItemText>{str}</ListItemText>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <CustomCard>
      <CardHeader title={project.title} subheader={project.deadline} />
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
          <Typography>Assigned Personnel:</Typography>
          {personnel && personnel.length ? (
            displayList(
              (personnel as Person[]).map(person => {
                return person.userEmail;
              })
            )
          ) : (
            <Typography>There are no assigned personnel!</Typography>
          )}
        </CardContent>
      </Collapse>
    </CustomCard>
  );
};

export default ProjectCard;
