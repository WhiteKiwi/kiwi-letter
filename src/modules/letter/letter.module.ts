import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
	],
	controllers: [LetterController],
	providers: [LetterService, TemplateBuilder],
})
export class LetterModule {}
