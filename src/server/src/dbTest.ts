import { createConnection } from 'typeorm';
import ormconfig from '../ormconfig.json';

const test = async () => {
  const connection = await createConnection({
    ...ormconfig,
  } as any);
  await connection.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await connection.close();
};
