import customJoi from '../../shared/custom-joi';

export class AddReplyDto {
  content: string;
}

export const AddReplySchema = customJoi.object({
  content: customJoi.string().required(),
});
