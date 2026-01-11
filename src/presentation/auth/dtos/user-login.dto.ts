import customJoi from '../../shared/custom-joi';

export class UserLoginDto {
  username: string;
  password: string;
}

export const UserLoginSchema = customJoi.object({
  username: customJoi.string().required(),
  password: customJoi.string().required(),
});
