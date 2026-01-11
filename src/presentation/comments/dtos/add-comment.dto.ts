import customJoi from '../../shared/custom-joi';

export class AddCommentDto {
  content: string;
}

export const AddCommentSchema = customJoi.object({
  content: customJoi.string().required(),
});
