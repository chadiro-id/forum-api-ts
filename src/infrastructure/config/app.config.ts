import Joi from 'joi';

export interface AppConfigType {
  port: number;
  host: string;
}

export default {
  key: 'app',
  value: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
  joiSchema: Joi.object({
    port: Joi.number().integer().required(),
    host: Joi.string().required(),
  }),
};
