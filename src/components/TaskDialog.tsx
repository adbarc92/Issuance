// Todo: reportedBy should default to UserId
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
  Typography,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import Select from 'elements/Select';
import DateTimePicker from 'elements/DateTimePicker';

import { TaskPriority, TaskType, TaskStatus, Task } from 'types/task';

import { createTask, updateTask } from 'store/actions';

import { reRenderApp } from 'App';

import { isNotFilledOut, isTooLong, trimState } from 'utils/index';

import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'hooks/notification';

import { useForm, FormAction } from 'hooks/form';

import { useGetProjects, useGetPersonnel } from 'hooks/axiosHooks';

import LoadingSpinner from 'elements/LoadingSpinner';

import { Project } from 'types/project';
import { Person } from 'types/person';

const TextFieldWrapper = styled('div')(() => {
  return {
    margin: '1rem 0',
    width: '40rem',
    display: 'flex',
    justifyContent: 'space-between',
  };
});

const SelectWrapper = styled('div')(() => {
  return {
    marginRight: '1rem',
    width: '10rem',
  };
});

const SelectContainer = styled('div')((props: any) => {
  return {
    display: 'flex',
    justifyContent: 'flex-start',
  };
});

const ProjectsContainer = styled('div')(() => {
  return {
    marginTop: '1rem',
    marginBottom: '0.5rem',
    marginLeft: '0.5rem',
  };
});

export interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  clearTasksCache: () => void;
  dialogTask: Task | null;
}

export interface TaskDialogState {
  name: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  deadline?: Date | string | null;
  projectId: string;
  reportedBy: string;
  storyPoints: number;
}

export enum TaskDialogAction {
  SET_NAME = 'setName',
  SET_DESCRIPTION = 'setDescription',
  SET_TASKTYPE = 'setTaskType',
  SET_TASKPRIORITY = 'setTaskPriority',
  SET_TASKSTATUS = 'setTaskStatus',
  SET_ASSIGNEDTO = 'setAssignedTo',
  SET_REPORTEDBY = 'setReportedBy',
  SET_DEADLINE = 'setDeadline',
  SET_PROJECT = 'setProject',
  SET_STORYPOINTS = 'setStoryPoints',
  RESET_STATE = 'setState',
}

const TaskPriorityMap = {
  [TaskPriority.HIGHEST]: {
    label: 'Highest',
  },
  [TaskPriority.HIGH]: {
    label: 'High',
  },
  [TaskPriority.MEDIUM]: {
    label: 'Medium',
  },
  [TaskPriority.LOW]: {
    label: 'Low',
  },
  [TaskPriority.LOWEST]: {
    label: 'Lowest',
  },
};

const TaskStatusMap = {
  [TaskStatus.BACKLOG]: {
    label: 'Backlog',
  },
  [TaskStatus.ACTIVE]: {
    label: 'Active',
  },
  [TaskStatus.COMPLETE]: {
    label: 'Complete',
  },
};

const TaskTypeMap = {
  [TaskType.FEATURE]: { label: 'Feature' },
  [TaskType.BUG]: { label: 'Bug' },
  [TaskType.EPIC]: { label: 'Epic' },
};

const taskToDialogState = (task: Task | null): TaskDialogState | null => {
  if (task) {
    const {
      name,
      description,
      type,
      priority,
      status,
      assignedTo,
      deadline,
      projectId,
      reportedBy,
      storyPoints,
    } = task;
    return {
      name,
      description,
      type,
      priority,
      status,
      assignedTo: assignedTo ?? '',
      deadline,
      projectId,
      reportedBy: reportedBy ?? '',
      storyPoints,
    };
  }
  return null;
};

const TaskDialog = (props: TaskDialogProps): JSX.Element => {
  const initialState = taskToDialogState(props.dialogTask) || {
    name: '',
    description: '',
    type: TaskType.FEATURE,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.BACKLOG,
    assignedTo: '',
    reportedBy: '',
    projectId: '',
    deadline: new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000
    ).toISOString(), // defaults to tomorrow
    storyPoints: 0,
    rowIndex: 0,
  };

  const {
    loading: projectLoading,
    data: projectData,
    error: projectError,
  } = useGetProjects();

  const {
    loading: personLoading,
    data: personData,
    error: personError,
  } = useGetPersonnel();

  // console.log('projectData:', projectData);

  const addingTask = taskToDialogState(props.dialogTask) ? false : true;

  const {
    state,
    submit,
    reset,
    errors,
    triedSubmit,
    dispatch,
    pristine,
  } = useForm({
    initialState,
    reducer: (state: TaskDialogState, action: FormAction): TaskDialogState => {
      let newState = { ...state };
      switch (action.type) {
        case TaskDialogAction.SET_NAME:
          newState.name = action.payload;
          break;
        case TaskDialogAction.SET_DESCRIPTION:
          newState.description = action.payload;
          break;
        case TaskDialogAction.SET_TASKTYPE:
          newState.type = action.payload;
          break;
        case TaskDialogAction.SET_TASKPRIORITY:
          newState.priority = action.payload;
          break;
        case TaskDialogAction.SET_TASKSTATUS:
          newState.status = action.payload;
          break;
        case TaskDialogAction.SET_ASSIGNEDTO:
          newState.assignedTo = action.payload;
          break;
        case TaskDialogAction.SET_REPORTEDBY:
          newState.reportedBy = action.payload;
          break;
        case TaskDialogAction.SET_DEADLINE:
          newState.deadline = action.payload;
          break;
        case TaskDialogAction.SET_PROJECT:
          newState.projectId = action.payload;
          break;
        case TaskDialogAction.SET_STORYPOINTS:
          newState.storyPoints = action.payload;
          break;
        case TaskDialogAction.RESET_STATE:
          newState = initialState;
          break;
      }
      return newState;
    },
    validateState: (
      state: TaskDialogState
    ): undefined | Record<string, string> => {
      const errors: Record<string, string> = {};
      const vState = { ...state };

      trimState(vState);

      if (isNotFilledOut(vState.name)) {
        errors.name = 'A name must be provided.';
      }
      if (isNotFilledOut(vState.description)) {
        errors.description = 'A description must be provided.';
      }
      if (isTooLong(vState.name, 180)) {
        errors.name = 'A name cannot be longer than 180 characters.';
      }
      if (isTooLong(vState.description, 5000)) {
        errors.description =
          'A description cannot be longer than 5000 characters.';
      }
      if (vState.projectId === '') {
        errors.projectId = 'An associated project is required.';
      }
      return Object.keys(errors).length ? errors : undefined;
    },
    onSubmit: async () => {
      if (errors) {
        showNotification(
          "Task doesn't meet requirements.",
          NotificationSeverity.ERROR
        );
        return;
      }

      trimState(state);

      const taskToSubmit = {
        name: state.name,
        description: state.description,
        type: state.type,
        priority: state.priority,
        status: state.status,
        assignedTo: state.assignedTo,
        deadline: state.deadline as string,
        projectId: state.projectId,
        storyPoints: state.storyPoints,
        rowIndex: 0,
      };

      const task = await (addingTask
        ? createTask(taskToSubmit)
        : updateTask((props.dialogTask as Task).id, taskToSubmit));

      if (task) {
        showNotification(
          `Task ${addingTask ? 'created' : 'edited'} successfully!`,
          NotificationSeverity.SUCCESS
        );
        handleClose();
        if (addingTask) {
          clearTasksCache();
        } else {
          reRenderApp();
        }
      } else {
        showNotification(
          `Task ${addingTask ? 'creation' : 'editing'} failed!`,
          NotificationSeverity.ERROR
        );
      }
    },
  });

  const { open, onClose, clearTasksCache } = props;

  const [snackbar, showNotification] = useNotificationSnackbar();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      {snackbar}
      <Dialog
        maxWidth="lg"
        aria-labelledby="simple-dialog-title"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="task-dialog-title">
          {addingTask ? 'Add' : 'Edit'} Task
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {addingTask ? 'Add a task to' : 'Edit a task in'} the database
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Task Name"
            type="text"
            fullWidth
            value={state.name}
            onChange={e => {
              dispatch({
                type: TaskDialogAction.SET_NAME,
                payload: e.target.value,
              });
            }}
          />
          <TextFieldWrapper>
            <TextField
              margin="dense"
              id="description"
              label="Task Description"
              type="text"
              multiline={true}
              variant="outlined"
              rows={8}
              fullWidth
              value={state.description}
              onChange={e => {
                dispatch({
                  type: TaskDialogAction.SET_DESCRIPTION,
                  payload: e.target.value,
                });
              }}
            />
          </TextFieldWrapper>
          <SelectContainer>
            <SelectWrapper>
              <Select
                fullWidth
                title={'Task Priority'}
                items={Object.keys(TaskPriorityMap).map(key => {
                  return {
                    label: TaskPriorityMap[key].label,
                    value: key,
                  };
                })}
                onChange={e => {
                  dispatch({
                    type: TaskDialogAction.SET_TASKPRIORITY,
                    payload: e.target.value,
                  });
                }}
                value={state.priority}
              />
            </SelectWrapper>
            <SelectWrapper>
              <Select
                fullWidth
                title={'Task Type'}
                items={Object.keys(TaskTypeMap).map(key => {
                  return {
                    label: TaskTypeMap[key].label,
                    value: key,
                  };
                })}
                onChange={e => {
                  dispatch({
                    type: TaskDialogAction.SET_TASKTYPE,
                    payload: e.target.value,
                  });
                }}
                value={state.type}
              />
            </SelectWrapper>
            <SelectWrapper>
              <TextField
                id="storyPoints"
                margin="dense"
                type="number"
                label="Story Points"
                value={state.storyPoints}
                onChange={e => {
                  dispatch({
                    type: TaskDialogAction.SET_STORYPOINTS,
                    payload: e.target.value,
                  });
                }}
              />
            </SelectWrapper>
            <SelectWrapper>
              <Select
                fullWidth
                title={'Task Status'}
                items={Object.keys(TaskStatusMap).map(key => {
                  return {
                    label: TaskStatusMap[key].label,
                    value: key,
                  };
                })}
                onChange={e => {
                  dispatch({
                    type: TaskDialogAction.SET_TASKSTATUS,
                    payload: e.target.value,
                  });
                }}
                value={state.status}
              />
            </SelectWrapper>
          </SelectContainer>
          <SelectContainer>
            <SelectWrapper>
              {personLoading ? (
                <LoadingSpinner />
              ) : (
                <Select
                  fullWidth
                  title={'Assigned Person'}
                  items={(personData as Person[]).map(person => {
                    return {
                      label: person.firstName + person.lastName,
                      value: person.id,
                    };
                  })}
                  onChange={e => {
                    dispatch({
                      type: TaskDialogAction.SET_ASSIGNEDTO,
                      payload: e.target.value,
                    });
                  }}
                  value={state.assignedTo}
                />
              )}
            </SelectWrapper>
            <SelectWrapper>
              {personLoading ? (
                <LoadingSpinner />
              ) : (
                <Select
                  fullWidth
                  title={'Reported By'}
                  items={(personData as Person[]).map(person => {
                    return {
                      label: person.firstName + person.lastName,
                      value: person.id,
                    };
                  })}
                  onChange={e => {
                    dispatch({
                      type: TaskDialogAction.SET_REPORTEDBY,
                      payload: e.target.value,
                    });
                  }}
                  value={state.reportedBy}
                />
              )}
            </SelectWrapper>
          </SelectContainer>
          <SelectContainer>
            <DateTimePicker
              value={state.deadline as string}
              onChange={value =>
                dispatch({
                  type: TaskDialogAction.SET_DEADLINE,
                  payload: value,
                })
              }
            />
            {projectLoading ? (
              <>
                <LoadingSpinner />
                <Typography>Awaiting Projects...</Typography>
              </>
            ) : (
              <ProjectsContainer>
                <SelectWrapper>
                  <Select
                    fullWidth
                    title={'Project'}
                    items={(projectData as Project[]).map(project => {
                      return {
                        label: project.title,
                        value: project.id,
                      };
                    })}
                    onChange={e => {
                      dispatch({
                        type: TaskDialogAction.SET_PROJECT,
                        payload: e.target.value,
                      });
                    }}
                    value={state.projectId}
                  />
                </SelectWrapper>
              </ProjectsContainer>
            )}
          </SelectContainer>
        </DialogContent>
        {projectError ? (
          <Alert severity="error">Project Error occurred: {projectError}</Alert>
        ) : null}
        {personError ? (
          <Alert severity="error">
            Personnel Error occurred: {personError}
          </Alert>
        ) : null}
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
          <Button
            variant="contained"
            onClick={submit}
            disabled={pristine}
            color="primary"
          >
            {addingTask ? 'Submit' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskDialog;
