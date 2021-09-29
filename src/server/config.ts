import dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

const {
  DB_USERNAME,
  DB_HOST,
  DB_PASSWORD,
  DB_NAME,
  DB_CONNECTION_NAME,
  DB_PORT,
  IMGUR_CLIENT_ID,
  IMGUR_CLIENT_SECRET,
  IMGUR_REFRESH_TOKEN,
} = process.env;

export const ormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: parseInt(DB_PORT) || 5432,
  name: DB_CONNECTION_NAME || 'default',
  host: DB_HOST || 'localhost',
  username: DB_USERNAME || 'postgres',
  password: DB_PASSWORD || 'postgres',
  database: DB_NAME || 'issuance',
  entities: ['src/entity/*.ts'],
  logging: false,
  synchronize: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

export const imgurConfig = {
  clientId: IMGUR_CLIENT_ID || 'DEFAULT_IMGUR_CLIENT_ID',
  clientSecret: IMGUR_CLIENT_SECRET || 'DEFAULT_IMGUR_CLIENT_SECRET',
  refreshToken: IMGUR_REFRESH_TOKEN || 'DEFAULT_IMGUR_REFRESH_TOKEN',
};
