import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
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
	async getPage(@Query() query: any): Promise<string> {
		if (query.code !== '잘생긴지훈') {
			return 'Invalid code parameter';
		}
		const letters = await this.letterService.getLetters();
		return this.templateBuilder.build(letters);
	}

	@Post()
	async createLetter(
		@Query() query: any,
		@Body()
		{
			name = '',
			content = '',
			hidden = 'false',
		}: { name?: string; content?: string; hidden?: string },
		@Res() res: Response,
	): Promise<Promise<void>> {
		if (query.code !== '잘생긴지훈') {
			res.redirect('/');
			return;
		}

		if (!name.trim()) {
			res.redirect('/?code=잘생긴지훈&message=' + '이름을 작성해주세요');
			return;
		}
		if (!content.trim()) {
			res.redirect('/?code=잘생긴지훈&message=' + '내용을 작성해주세요');
			return;
		}
		await this.letterService.createLetter({
			name,
			content,
			hidden: hidden === 'true',
		});

		res.redirect('/?code=잘생긴지훈&message=' + '작성되었습니다.');
	}
}
