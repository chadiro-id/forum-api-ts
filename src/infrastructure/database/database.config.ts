import Joi from 'joi';

export interface DatabaseConfigType {
  url?: string;
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export default {
  key: 'db',
  value: {
    url: process.env.DATABASE_URL,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
  },
  joiSchema: Joi.object({
    url: Joi.string(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().integer().required(),
    database: Joi.string().required(),
  }),
};
