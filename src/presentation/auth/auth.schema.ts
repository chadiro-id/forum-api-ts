import customJoi from '../shared/custom-joi';

export const UserLoginSchema = customJoi.object({
  username: customJoi.string().required(),
  password: customJoi.string().required(),
});

export const RefreshAuthSchema = customJoi.object({
  refreshToken: customJoi.string().required(),
});

export const UserLogoutSchema = RefreshAuthSchema;
