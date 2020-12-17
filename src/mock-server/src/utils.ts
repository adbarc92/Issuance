import { randomBytes, createHmac } from 'crypto-js';

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
  const salt = generateRandomString(16);
  return sha256(userpassword, salt);
};
