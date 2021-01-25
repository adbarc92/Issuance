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

import Select from 'elements/Select';
import DateTimePicker from 'elements/DateTimePicker';

import { Person } from 'types/person';

import { createTask, updateTask } from 'store/actions';

import { reRenderApp } from 'App';

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
  deadline: string | Date;
}

interface ProjectDialogProps {
  project: Project | null;
  dialogOpen: boolean;
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
    // selectedAvailablePersonnel: [],
    assignedPersonnel: [],
    // selectedAssignedPersonnel: [],
    deadline: '',
  };

  const reducer = (
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
  };

  // const {state,submit,reset,errors,triedSubmit, dispatch} = useForm({initialState, reducer: : ProjectDialogState => {
  // 	let newState = {...state};
  // }, validateState: (),onSubmit: ())

  return (
    <>
      <Dialog open={props.dialogOpen}>
        <div>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogContent></DialogContent>
        </div>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="project-name"
            label="Name Your Project..."
            // value={state.title}
            type="text"
            fullWidth
          ></TextField>
          <TextField></TextField>
        </DialogContent>
      </Dialog>
    </>
  );
};
