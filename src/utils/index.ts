// *** Utils cannot be included in server due to import problems
import { TaskPriority, TaskType, TaskStatus } from 'types/task';
import { PersonJob, Person } from 'types/person';
import { UserRole } from 'types/user';
import { SelectItem } from 'elements/Select';
import { SocketEventType } from 'types/subscription';
import { ClientNotification } from 'types/notification';
import { Greetings } from 'types/navigation';

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

export const getPersonName = (person: Person): string => {
  if (person.firstName && person.lastName) {
    return `${person.firstName} ${person.lastName}`;
  } else if (person.firstName) {
    return person.firstName;
  } else {
    return person.userEmail;
  }
};

export const createNotificationMessage = (
  notification: ClientNotification
): string => {
  return JSON.stringify(notification);
};

export const formatDate = (date: Date): string => {
  const hour = date.getHours();
  const minutes = date.getMinutes();

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return `${hour > 12 ? hour - 12 : hour}:${
    minutes < 10 ? '0' + minutes : minutes
  } ${hour >= 12 ? 'PM' : 'AM'} ${month}/${day}/${year}`;
};

export const makeGreeting = (): Greetings => {
  const d = new Date();
  const hour = d.getHours();

  if (hour < 6) {
    return Greetings.EARLY_MORNING;
  } else if (hour < 12) {
    return Greetings.MORNING;
  } else if (hour < 17) {
    return Greetings.AFTERNOON;
  } else if (hour < 20) {
    return Greetings.EVENING;
  }

  return Greetings.NIGHT;
};

export const fixWordCasing = (word: string): string => {
  return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
};
