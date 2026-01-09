import Joi from 'joi';

export type JwtConfigType = {
  accessToken: { secret: string; expirationTime: number };
  refreshToken: { secret: string };
};

export default {
  key: 'jwt',
  value: {
    accessToken: {
      secret: process.env.ACCESS_TOKEN_KEY,
      expirationTime: process.env.ACCESS_TOKEN_AGE,
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_KEY,
    },
  },
  joiSchema: Joi.object({
    accessToken: Joi.object({
      secret: Joi.string().required(),
      expirationTime: Joi.number().integer().required(),
    }),
    refreshToken: Joi.object({
      secret: Joi.string().required(),
    }),
  }),
};
