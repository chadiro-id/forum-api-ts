import customJoi from '../shared/custom-joi';

export const AddCommentSchema = customJoi.object({
  content: customJoi.string().required(),
});
