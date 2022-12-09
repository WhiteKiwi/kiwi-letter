import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Env } from '../../config/env';

@Injectable()
export class RedisService {
	private readonly redis: Redis;
	constructor(private readonly configService: ConfigService<Env>) {
		const host = this.configService.get('REDIS_HOST');
		const password = this.configService.get('REDIS_PASSWORD');
		this.redis = new Redis({
			host,
			port: 6379,
			username: '',
			password,
		});
	}

	async get(key: string): Promise<string | null> {
		return await this.redis.get(key);
	}

	async set(key: string, value: string): Promise<void> {
		await this.redis.set(key, value);
	}
}
