import Joi from 'joi';

export interface DatabaseConfigType {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export default {
  key: 'db',
  value: {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
  },
  joiSchema: Joi.object({
    user: Joi.string().required(),
    password: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().integer().required(),
    database: Joi.string().required(),
  }),
};
