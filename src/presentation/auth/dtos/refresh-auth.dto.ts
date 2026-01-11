import customJoi from '../../shared/custom-joi';

export class RefreshAuthDto {
  refreshToken: string;
}

export const RefreshAuthSchema = customJoi.object({
  refreshToken: customJoi.string().required(),
});
