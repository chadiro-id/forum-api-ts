import Joi from 'joi';

export interface DatabaseConfigType {
  pgUrl?: string;
  pg?: {
    user?: string;
    password?: string;
    host?: string;
    port?: number;
    database?: string;
  };
}

export default {
  key: 'db',
  value: {
    pgUrl: process.env.DATABASE_URL,
    pg: {
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_DATABASE,
    },
  },
  joiSchema: Joi.object({
    pgUrl: Joi.string(),
    pg: Joi.object({
      user: Joi.string(),
      password: Joi.string(),
      host: Joi.string(),
      port: Joi.number().integer(),
      database: Joi.string(),
    }),
  }),
};
