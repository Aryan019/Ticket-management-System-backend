import { Pool } from "pg";

export const pool = new Pool({
    user: 'chaiaurcode',
    host: 'localhost',
    database: 'chaiDB',
    password: 'chaiaurcode',
    port: 5432, // default port for PostgreSQL
  });
  