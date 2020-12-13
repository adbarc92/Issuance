import { TaskPriority, TaskType, TaskStatus } from 'types/task';
import { UserRole } from 'types/user';
import { SelectItem } from 'elements/Select';

export const isNotFilledOut = (field: any): boolean => {
  return ['', undefined].includes(field);
};

export const isTooLong = (field: string, length: number): boolean => {
  return field.length >= length;
};

export const trimState = function <T>(state: T): void {
  for (const i in state) {
    state[i] = (state[i] as any).trim();
  }
};

export const mapEnumToSelectItems = (
  set:
    | typeof TaskPriority
    | typeof TaskType
    | typeof TaskStatus
    | typeof UserRole
): SelectItem<string>[] => {
  return Object.keys(set).map(key => {
    return { label: set[key], value: set[key] };
  });
};
