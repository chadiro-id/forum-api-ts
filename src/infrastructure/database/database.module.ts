import { Pool } from 'pg';
import { parseIntoClientConfig } from 'pg-connection-string';
import { Module } from '../../libs/my-app/common/modules/modules.decorator';
import { ConfigService } from '../config/config-service';
import databaseConfig, { DatabaseConfigType } from './database.config';

export const PG_POOL = Symbol('PG_POOL');

@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfigType>(
          databaseConfig.key,
        );
        if (dbConfig.url) {
          console.log('pool connection string', dbConfig.url);
          const config = parseIntoClientConfig(dbConfig.url);
          return new Pool(config);
        }
        return new Pool(dbConfig);
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
