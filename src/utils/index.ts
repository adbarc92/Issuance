import { TaskPriority, TaskType, TaskStatus } from 'types/task';
import { PersonJob } from 'types/person';
import { UserRole } from 'types/user';
import { SelectItem } from 'elements/Select';
import { SocketEventType } from 'types/subscription';

export const isEmailValid = (email: string): boolean => {
  const EMAIL_REGEX = /^(([^<>()[\]\\,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result = email.match(EMAIL_REGEX);
  return result ? true : false;
};

export const isNotFilledOut = (field: any): boolean => {
  return ['', undefined].includes(field);
};

export const isTooLong = (field: string, length: number): boolean => {
  return field.length >= length;
};

export const trimState = function <T>(state: T): void {
  for (const i in state) {
    if (typeof state[i] === 'string') {
      state[i] = (state[i] as any).trim();
    }
  }
};

export const mapEnumToSelectItems = (
  set:
    | typeof TaskPriority
    | typeof TaskType
    | typeof TaskStatus
    | typeof UserRole
    | typeof PersonJob
): SelectItem<string>[] => {
  return Object.keys(set).map(key => {
    return { label: set[key], value: set[key] };
  });
};

export const createSocketEventName = (
  socketEventType: SocketEventType,
  socketEventNumber: string
): string => {
  return socketEventType + socketEventNumber;
};
