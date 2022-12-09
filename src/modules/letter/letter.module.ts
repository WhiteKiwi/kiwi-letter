import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '../../core';

import { LetterBatchService } from './letter.batch.service';
import { LetterController } from './letter.controller';
import { Letter, LetterSchema } from './letter.entity';
import { LetterService } from './letter.service';
import { TemplateBuilder } from './template.builder';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Letter.name,
				schema: LetterSchema,
			},
		]),
		RedisModule,
	],
	controllers: [LetterController],
	providers: [LetterService, LetterBatchService, TemplateBuilder],
})
export class LetterModule {}
