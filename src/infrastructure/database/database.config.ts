import Joi from 'joi';

export interface DatabaseConfigType {
  pgUrl?: string;
  pg?: {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
  };
}

export default {
  key: 'db',
  value: { pgUrl: process.env.DATABASE_URL },
  joiSchema: Joi.object({ pgUrl: Joi.string() }),
};
