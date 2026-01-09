import { UserLoginCommandHandler } from '../../application/authentications/command/handler/user-login.command-handler';
import { UserLogoutCommandHandler } from '../../application/authentications/command/handler/user-logout.command-handler';
import { RefreshAuthCommandHandler } from '../../application/authentications/command/handler/refresh-auth.command-handler';
import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
} from '../../libs/my-app/common/controllers/controllers.decorator';
import { RefreshAuthDto, UserLoginDto, UserLogoutDto } from './auth.dto';
import { UserLoginCommand } from '../../application/authentications/command/user-login.command';
import { RefreshAuthCommand } from '../../application/authentications/command/refresh-auth.command';
import { UserLogoutCommand } from '../../application/authentications/command/user-logout.command';

@Controller('/authentications')
export class AuthController {
  constructor(
    private userLoginCommandHandler: UserLoginCommandHandler,
    private userLogoutCommandHandler: UserLogoutCommandHandler,
    private refreshAuthCommandHandler: RefreshAuthCommandHandler,
  ) {}

  @HttpCode(201)
  @Post()
  async login(@Body() dto: UserLoginDto) {
    const command = new UserLoginCommand(dto.username, dto.password);
    const result = await this.userLoginCommandHandler.handle(command);

    return result;
  }

  @Put()
  async refreshAuth(@Body() dto: RefreshAuthDto) {
    const command = new RefreshAuthCommand(dto.refreshToken);
    const { accessToken } =
      await this.refreshAuthCommandHandler.handle(command);

    return {
      accessToken,
    };
  }

  @Delete()
  async logout(@Body() dto: UserLogoutDto) {
    const command = new UserLogoutCommand(dto.refreshToken);
    await this.userLogoutCommandHandler.handle(command);
  }
}
