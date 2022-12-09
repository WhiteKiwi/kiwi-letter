import { HealthCheckModule } from '@kiwi-lib/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Env } from './config/env';
import { ApiModule } from './modules';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
			cache: true,
		}),
		HealthCheckModule,
		ApiModule,
		ScheduleModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService<Env>) => ({
				uri: configService.get<string>(
					'MONGO_DB_CONNECTION_URI',
					'mongodb://localhost:27017/scraping_batch?ssl=false',
				),
			}),
		}),
	],
})
export class AppModule {}
