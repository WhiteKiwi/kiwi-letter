import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LetterService } from './letter.service';
import { TemplateBuilder } from './template.builder';

@Controller()
export class LetterController {
	constructor(
		private readonly letterService: LetterService,
		private readonly templateBuilder: TemplateBuilder,
	) {}

	@Get()
	async getPage(): Promise<string> {
		const letters = await this.letterService.getLetters();
		return this.templateBuilder.build(letters);
	}

	@Post()
	async createLetter(
		@Body() { name = '', content = '' }: { name?: string; content?: string },
		@Res() res: Response,
	): Promise<Promise<void>> {
		if (!name.trim()) {
			res.redirect('/?message=' + '이름을 작성해주세요');
			return;
		}
		if (!content.trim()) {
			res.redirect('/?message=' + '내용을 작성해주세요');
			return;
		}
		await this.letterService.createLetter({
			name,
			content,
		});

		res.redirect('/?message=' + '작성되었습니다.');
	}
}
