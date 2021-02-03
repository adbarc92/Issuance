import React from 'react';

import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

// import Select from 'elements/Select';
import DateTimePicker from 'elements/DateTimePicker';

import { Person } from 'types/person';

import { createProject } from 'store/actions';

// import { reRenderApp } from 'App';

import { isNotFilledOut, isTooLong, trimState } from 'utils/index';

import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'hooks/notification';

import { useForm } from 'hooks/form';

import { Project } from 'types/project';

interface ProjectDialogState {
  title: string;
  description: string;
  availablePersonnel: Person[];
  assignedPersonnel: Person[];
  deadline?: Date | string | null;
}

interface ProjectDialogProps {
  // project: Project | null;
  showingDialog: boolean;
  hideDialog: () => void;
}

interface IProjectDialogAction {
  type: string;
  payload?: any;
}

export enum ProjectDialogAction {
  SET_TITLE = 'setTitle',
  SET_DESCRIPTION = 'setDescription',
  SET_AVAILABLE_PERSONNEL = 'setAvailablePersonnel',
  SET_ASSIGNED_PERSONNEL = 'setAssignedPersonnel',
  SET_DEADLINE = 'setDeadline',
}

// S/N: Personnel need an additional property--selected--that will determine if their column changes on arrow click
const ProjectDialog = (props: ProjectDialogProps): JSX.Element => {
  const initialState: ProjectDialogState = {
    title: '',
    description: '',
    availablePersonnel: [],
    assignedPersonnel: [],
    deadline: new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000
    ).toISOString(), // defaults to tomorrow,
  };

  // const [
  //   selectedAvailablePersonnel,
  //   setSelectedAvailablePersonnel,
  // ] = React.useState<Person[]>([]);

  // const [
  //   selectedAssignedPersonnel,
  //   setSelectedAssignedPersonnel,
  // ] = React.useState<Person[]>([]);

  const { state, submit, reset, errors, triedSubmit, dispatch } = useForm({
    initialState,
    reducer: (
      state: ProjectDialogState,
      action: IProjectDialogAction
    ): ProjectDialogState => {
      const newState = { ...state };
      switch (action.type) {
        case ProjectDialogAction.SET_TITLE:
          newState.title = action.payload;
          break;
        case ProjectDialogAction.SET_DESCRIPTION:
          newState.description = action.payload;
          break;
        case ProjectDialogAction.SET_AVAILABLE_PERSONNEL:
          newState.availablePersonnel = action.payload;
          break;
        case ProjectDialogAction.SET_ASSIGNED_PERSONNEL:
          newState.assignedPersonnel = action.payload;
          break;
        case ProjectDialogAction.SET_DEADLINE:
          newState.title = action.payload;
          break;
      }
      return newState;
    },
    validateState: (
      state: ProjectDialogState
    ): undefined | Record<string, string> => {
      const errors: Record<string, string> = {};
      const vState = { ...state };

      trimState(vState);

      if (isNotFilledOut(vState.title)) {
        errors.title = 'A title must be provided';
      }
      if (isTooLong(vState.title, 180)) {
        errors.title = 'A title cannot be longer than 180 characters';
      }
      // ...
      return Object.keys(errors).length ? errors : undefined;
    },
    onSubmit: async () => {
      if (errors) {
        showNotification(
          'Project does not meet requirements',
          NotificationSeverity.ERROR
        );
        return;
      }

      trimState(state);

      const projectToSubmit = {
        title: state.title,
        description: state.description,
        assignedPersonnel: state.assignedPersonnel,
        deadline: state.deadline,
      };

      const project = await createProject(projectToSubmit);

      if (project) {
        showNotification('Project created', NotificationSeverity.SUCCESS);
        handleClose();
      }
    },
  });

  const [snackbar, showNotification] = useNotificationSnackbar();

  const handleClose = () => {
    reset();
    props.hideDialog();
  };

  return (
    <>
      {snackbar}
      <Dialog
        maxWidth="md"
        fullWidth
        open={props.showingDialog}
        onClose={handleClose}
      >
        <div>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogContent>
            <DialogContentText>Start a new endeavor</DialogContentText>
          </DialogContent>
        </div>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="project-name"
            label="Name Your Project..."
            value={state.title}
            type="text"
            onChange={e => {
              dispatch({
                type: ProjectDialogAction.SET_TITLE,
                payload: e.target.value,
              });
            }}
            fullWidth
          />
          <TextField
            margin="dense"
            value={state.description}
            label="Describe your project..."
            variant="outlined"
            fullWidth
            multiline={true}
            rows={6}
            onChange={e => {
              dispatch({
                type: ProjectDialogAction.SET_TITLE,
                payload: e.target.value,
              });
            }}
          />
          <DateTimePicker
            value={state.deadline as string}
            onChange={value =>
              dispatch({
                type: ProjectDialogAction.SET_DEADLINE,
                payload: value,
              })
            }
          />
        </DialogContent>
        {triedSubmit && errors ? (
          <DialogContent>
            {Object.values(errors).map((errorMessage, index) => {
              return (
                <Alert severity="error" key={index}>
                  {errorMessage}
                </Alert>
              );
            })}
          </DialogContent>
        ) : null}
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" onClick={submit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectDialog;
