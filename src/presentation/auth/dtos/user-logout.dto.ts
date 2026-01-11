import customJoi from '../../shared/custom-joi';

export class UserLogoutDto {
  refreshToken: string;
}

export const UserLogoutSchema = customJoi.object({
  refreshToken: customJoi.string().required(),
});
