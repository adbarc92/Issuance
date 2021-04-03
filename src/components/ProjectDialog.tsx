import React from 'react';

import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  styled,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import DateTimePicker from 'elements/DateTimePicker';

import { Project } from 'types/project';

import { createProject, updateProject } from 'store/actions';

import { isNotFilledOut, isTooLong, trimState } from 'utils/index';

import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'hooks/notification';

import { useForm } from 'hooks/form';

import { FormAction } from 'hooks/form';

const TrimmedDialogTitle = styled(DialogTitle)(() => {
  return {
    paddingBottom: '0rem',
  };
});

const TrimmedDialogContent = styled(DialogContent)(() => {
  return {
    paddingBottom: '0rem',
    paddingTop: '0rem',
  };
});

interface ProjectDialogState {
  title: string;
  description: string;
  deadline: Date | string | null;
  id?: string;
}

interface ProjectDialogProps {
  showingDialog: boolean;
  hideDialog: () => void;
  clearProjectsCache: () => void;
  project: Project | null;
}

export enum ProjectDialogAction {
  SET_TITLE = 'setTitle',
  SET_DESCRIPTION = 'setDescription',
  SET_AVAILABLE_PERSONNEL = 'setAvailablePersonnel',
  SET_ASSIGNED_PERSONNEL = 'setAssignedPersonnel',
  SET_DEADLINE = 'setDeadline',
}

const ProjectDialog = (props: ProjectDialogProps): JSX.Element => {
  const { showingDialog, hideDialog, clearProjectsCache, project } = props;

  const isCreatingProject = project ? false : true;

  const initialState: ProjectDialogState = isCreatingProject
    ? {
        title: '',
        description: '',
        deadline: new Date(
          new Date().getTime() + 24 * 60 * 60 * 1000
        ).toISOString(),
      }
    : {
        title: (project as Project).title,
        description: (project as Project).description,
        deadline: (project as Project).deadline,
        id: (project as Project).id,
      };

  const { state, submit, reset, errors, triedSubmit, dispatch } = useForm({
    initialState,
    reducer: (
      state: ProjectDialogState,
      action: FormAction
    ): ProjectDialogState => {
      const newState = { ...state };
      switch (action.type) {
        case ProjectDialogAction.SET_TITLE:
          newState.title = action.payload;
          break;
        case ProjectDialogAction.SET_DESCRIPTION:
          newState.description = action.payload;
          break;
        case ProjectDialogAction.SET_DEADLINE:
          newState.deadline = action.payload;
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
      if (isNotFilledOut(vState.description)) {
        errors.description = 'A description must be provided';
      }
      if (isTooLong(vState.description, 180)) {
        errors.description =
          'A description cannot be longer than 180 characters';
      }
      return Object.keys(errors).length ? errors : undefined;
    },
    onSubmit: async () => {
      if (errors) {
        console.log('Errors:', errors);
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
        deadline: state.deadline,
      };

      const project = isCreatingProject
        ? await createProject(projectToSubmit)
        : await updateProject(projectToSubmit, state.id as string);

      if (project) {
        showNotification('Project created', NotificationSeverity.SUCCESS);
        handleClose();
        clearProjectsCache();
      } else {
        showNotification(
          'Project creation failed!',
          NotificationSeverity.ERROR
        );
      }
    },
  });

  const [snackbar, showNotification] = useNotificationSnackbar();

  const handleClose = () => {
    reset();
    hideDialog();
  };

  return (
    <>
      {snackbar}
      <Dialog
        maxWidth="md"
        fullWidth
        open={showingDialog}
        onClose={handleClose}
      >
        <div>
          <TrimmedDialogTitle>Create New Project</TrimmedDialogTitle>
          <TrimmedDialogContent>
            <DialogContentText>Start a new endeavor</DialogContentText>
          </TrimmedDialogContent>
        </div>
        <TrimmedDialogContent>
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
            rows={5}
            onChange={e => {
              dispatch({
                type: ProjectDialogAction.SET_DESCRIPTION,
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
        </TrimmedDialogContent>
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
