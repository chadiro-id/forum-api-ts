export class UserLoginDto {
  username: string;
  password: string;
}

export class RefreshAuthDto {
  refreshToken: string;
}

export class UserLogoutDto {
  refreshToken: string;
}
