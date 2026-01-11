import customJoi from '../../shared/custom-joi';

export class RegisterUserDto {
  username: string;
  password: string;
  fullname: string;
}

export const RegisterUserSchema = customJoi.object({
  username: customJoi
    .string()
    .required()
    .max(50)
    .pattern(/^[\w]+$/)
    .messages({
      'string.base': 'username harus berupa teks',
      'any.required': 'username wajib diisi',
      'string.empty': 'username tidak boleh kosong',
      'string.max': 'username maksimal {#limit} karakter',
      'string.pattern.base':
        'tidak dapat membuat user baru karena username mengandung karakter terlarang',
    }),
  password: customJoi.string().required(),
  fullname: customJoi.string().required(),
});
