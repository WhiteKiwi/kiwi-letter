import { Module } from '@nestjs/common';

import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import { TemplateBuilder } from './template.builder';

@Module({
	controllers: [LetterController],
	providers: [LetterService, TemplateBuilder],
})
export class LetterModule {}
