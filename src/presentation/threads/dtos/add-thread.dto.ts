import customJoi from '../../shared/custom-joi';

export class AddThreadDto {
  title: string;
  body: string;
}

export const AddThreadSchema = customJoi.object({
  title: customJoi.string().required().max(255),
  body: customJoi.string().required(),
});
