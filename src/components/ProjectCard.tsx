import React from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Collapse,
  List,
  ListItem,
  ListItemText,
  IconButton,
  styled,
} from '@material-ui/core';

import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

import { Project } from 'types/project';

interface ProjectCardProps {
  project: Project;
}

const CustomCard = styled(Card)(() => {
  return {
    maxWidth: '350px',
  };
});

const ProjectCard = (props: ProjectCardProps): JSX.Element => {
  const { project } = props;

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <CustomCard>
      <CardHeader title={project.title} subheader={project.deadline} />
      <CardContent>
        <Typography>{project.description}</Typography>
      </CardContent>
      <CardActions>
        <IconButton
          // className={clsx(classes.expand, {
          //   [classes.expandOpen]: expanded,
          // })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Assigned Personnel:</Typography>
          <Typography>This is where top 3 tickets will go</Typography>
          <Typography paragraph>Assigned Personnel:</Typography>
          <List>
            {project.personnel?.map((person, index) => {
              return (
                <ListItem key={index}>
                  <ListItemText>{person}</ListItemText>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Collapse>
    </CustomCard>
  );
};

export default ProjectCard;
