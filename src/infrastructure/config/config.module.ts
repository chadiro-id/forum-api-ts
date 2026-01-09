import { Module } from '../../libs/my-app/common/modules/modules.decorator';
import { ConfigService } from './config-service';
import databaseConfig from '../database/database.config';
import jwtConfig from './jwt.config';

@Module({
  providers: [
    {
      provide: 'CONFIG_OPTIONS',
      useValue: { load: [databaseConfig, jwtConfig] },
    },
    {
      provide: ConfigService,
      useClass: ConfigService,
    },
  ],
})
export class ConfigModule {}
