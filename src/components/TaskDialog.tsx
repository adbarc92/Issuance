import React from 'react';

import MySelect from 'elements/MySelect';
import { TaskPriority, TaskType, TaskStatus } from 'types/task';

import { createTask } from 'store/axiosHooks';

import {
  useNotificationSnackbar,
  NotificationSeverity,
} from 'store/useNotification';

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

import { KeyboardDatePicker } from '@material-ui/pickers';

// Tasks need:
// Dropdown: Priority, Type, Status,
// Input: name, summary, description,
// Date: deadline,
// ???: project id

const SelectContainer = styled('div')((props: any) => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
  };
});

export interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  clearTasksCache: () => void;
}

const mapEnumToArr = (
  set: typeof TaskPriority | typeof TaskType | typeof TaskStatus
) => {
  return [Object.keys(set), Object.values(set)];
};

const TaskDialog = (props: TaskDialogProps): JSX.Element => {
  const { open, onClose, clearTasksCache } = props;

  const [name, setName] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [taskType, setTaskType] = React.useState<TaskType>(TaskType.FEATURE);
  const [taskStatus, setTaskStatus] = React.useState<TaskStatus>(
    TaskStatus.BACKLOG
  );
  const [taskPriority, setTaskPriority] = React.useState<TaskPriority>(
    TaskPriority.MEDIUM
  );

  // const [deadline, setDeadline] = React.useState<Date | null>(null);

  const [priorityKeys, priorityValues] = mapEnumToArr(TaskPriority);
  const [typeKeys, typeValues] = mapEnumToArr(TaskType);
  const [statusKeys, statusValues] = mapEnumToArr(TaskStatus);

  const [snackbar, showNotification] = useNotificationSnackbar();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    const task = await createTask(
      name,
      summary,
      description,
      TaskType[taskType],
      TaskPriority[taskPriority],
      TaskStatus[taskStatus]
    );
    if (task) {
      showNotification(
        'Task created successfully!',
        NotificationSeverity.SUCCESS
      );
      onClose();
      clearTasksCache();
    } else {
      showNotification('User creation failed!', NotificationSeverity.ERROR);
    }
  };

  return (
    <>
      {snackbar}
      <Dialog
        aria-labelledby="simple-dialog-title"
        open={open}
        onClose={() => onClose}
      >
        <DialogTitle id="task-dialog-title">Add Task</DialogTitle>
        <DialogContent>
          <DialogContentText>Add a Task to the database</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Task Name"
            type="text"
            fullWidth
            value={name}
            onChange={e => {
              setName(e.target.value);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="summary"
            label="Task Summary"
            type="text"
            fullWidth
            value={summary}
            onChange={e => {
              setSummary(e.target.value);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Task Description"
            type="text"
            fullWidth
            value={description}
            onChange={e => {
              setDescription(e.target.value);
            }}
          />
          <SelectContainer>
            <MySelect
              title={'Task Priority'}
              keys={priorityKeys}
              values={priorityValues}
              onChange={e => {
                setTaskPriority(e.target.value);
              }}
              value={taskPriority}
            />
            <MySelect
              title={'Task Type'}
              keys={typeKeys}
              values={typeValues}
              onChange={e => {
                setTaskType(e.target.value);
              }}
              value={taskType}
            />
            <MySelect
              title={'Task Status'}
              keys={statusKeys}
              values={statusValues}
              onChange={e => {
                setTaskStatus(e.target.value);
              }}
              value={taskStatus}
            />
          </SelectContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskDialog;
