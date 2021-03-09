import { randomBytes, createHmac } from 'crypto';

import { v4 as uuid } from 'uuid';

// Standardizes error messages for later handling, client-side
export const createErrorResponse = (errors: string[]): string => {
  return JSON.stringify({ errors });
};

export const generateRandomString = (length: number): string => {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

interface PasswordData {
  salt: string;
  passwordHash: string;
}

export const sha256 = (password: string, salt: string): PasswordData => {
  const hash = createHmac('sha256', salt);
  hash.update(password);
  const value = hash.digest('hex');
  return {
    salt,
    passwordHash: value,
  };
};

export const saltHashPassword = (userpassword: string): PasswordData => {
  // const salt = generateRandomString(16);
  const salt = uuid();
  return sha256(userpassword, salt);
};

export const toCamelCase = (str: string): string => {
  let ret = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '_' && str[i + 1] && i !== 0) {
      ret += str[i + 1].toUpperCase();
      i++;
    } else if (str[i] === '_') {
      continue;
    } else {
      ret += str[i];
    }
  }
  return ret;
};

export const camelCasify = (obj: any): any => {
  const retObj = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const newKey = toCamelCase(keys[i]);
    retObj[newKey] = obj[keys[i]];
  }
  return retObj;
};

export const toSnakeCase = (str: string): string => {
  let ret = '';
  for (let i = 0; i < str.length; i++) {
    if (
      !['_', '.', ',', '"', '\\', '/'].includes(str[i]) &&
      str[i] === str[i].toUpperCase()
    ) {
      ret += '_' + str[i].toLowerCase();
    } else {
      ret += str[i];
    }
  }
  return ret;
};

export const snakeCasify = (obj: any): any => {
  const retObj = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const newKey = toSnakeCase(keys[i]);
    retObj[newKey] = obj[keys[i]];
  }
  return retObj;
};

export type IoRequest = Request & { io: any };
