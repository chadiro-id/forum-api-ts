import customJoi from '../shared/custom-joi';

export const AddReplySchema = customJoi.object({
  content: customJoi.string().required(),
});
