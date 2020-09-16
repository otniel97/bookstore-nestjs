import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ConnectionOptions } from 'typeorm';
import { Configuration } from '../config/config.keys';

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        async useFactory(config: ConfigService){
            return {
                ssl: {require: true, rejectUnauthorized: false},
                type: 'postgres' as 'postgres',
                host: config.get(Configuration.HOST),
                database: config.get(Configuration.DATABASE),
                username: config.get(Configuration.USERNAME),
                password: config.get(Configuration.PASSWORD),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                migrations: [__dirname + '/migrations/*{.ts,.js}']
            } as ConnectionOptions
        }
    })
]