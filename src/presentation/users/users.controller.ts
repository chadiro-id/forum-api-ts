import { RegisterUserCommandHandler } from '../../application/users/command/handler/register-user.command-handler';
import { RegisterUserCommand } from '../../application/users/command/register-user.command';
import { RegisterUserDto } from './users.dto';
import {
  Body,
  Controller,
  HttpCode,
  Post,
} from '../../libs/my-app/common/controllers/controllers.decorator';

@Controller('/users')
export class UsersController {
  constructor(private registerUserCommandHandler: RegisterUserCommandHandler) {}

  @HttpCode(201)
  @Post()
  async register(@Body() dto: RegisterUserDto) {
    const command = new RegisterUserCommand(
      dto.username,
      dto.password,
      dto.fullname,
    );

    const addedUser = await this.registerUserCommandHandler.handle(command);

    return { addedUser };
  }
}
