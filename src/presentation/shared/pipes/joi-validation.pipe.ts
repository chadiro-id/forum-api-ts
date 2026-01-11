import Joi from 'joi';
import { InvariantError } from '../../../shared/errors/invariant-error';
import { PipeTransform } from '../../../libs/my-app/common/pipes/pipe-transform';
import { ArgumentMetadata } from '../../../libs/my-app/common/controllers/controllers.type';
import { RegisterUserDto } from '../../users/users.dto';
import { RegisterUserSchema } from '../../users/users.schema';
import { AddReplyDto } from '../../replies/replies.dto';
import { AddReplySchema } from '../../replies/replies.schema';
import { AddCommentDto } from '../../comments/comments.dto';
import { AddCommentSchema } from '../../comments/comments.schema';
import { AddThreadDto } from '../../threads/threads.dto';
import { AddThreadSchema } from '../../threads/threads.schema';
import { UserLoginDto, UserLoginSchema } from '../../auth/dtos/user-login.dto';
import {
  UserLogoutDto,
  UserLogoutSchema,
} from '../../auth/dtos/user-logout.dto';
import {
  RefreshAuthDto,
  RefreshAuthSchema,
} from '../../auth/dtos/refresh-auth.dto';

export class JoiValidationPipe implements PipeTransform {
  transform(value: any, argMeta: ArgumentMetadata) {
    if (argMeta.type !== 'body') return value;

    let schema: Joi.ObjectSchema | undefined;
    switch (argMeta.metatype) {
      case RegisterUserDto:
        schema = RegisterUserSchema;
        break;
      case UserLoginDto:
        schema = UserLoginSchema;
        break;
      case RefreshAuthDto:
        schema = RefreshAuthSchema;
        break;
      case UserLogoutDto:
        schema = UserLogoutSchema;
        break;
      case AddThreadDto:
        schema = AddThreadSchema;
        break;
      case AddCommentDto:
        schema = AddCommentSchema;
        break;
      case AddReplyDto:
        schema = AddReplySchema;
        break;
    }
    if (!schema) {
      return value;
    }
    return this.validate(schema, value);
  }

  validate(schema: Joi.ObjectSchema, value: any) {
    const result = schema.validate(value);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
    return result.value;
  }
}
