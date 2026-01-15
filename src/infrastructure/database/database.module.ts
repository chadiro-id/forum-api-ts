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
        if (dbConfig.pgUrl) {
          const config = parseIntoClientConfig(dbConfig.pgUrl);
          return new Pool(config);
        }
        if (dbConfig.pg) {
          return new Pool(dbConfig.pg);
        }
        return new Pool();
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
