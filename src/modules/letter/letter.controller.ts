import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { RedisService } from '../../core';
import { LetterService } from './letter.service';
import { TemplateBuilder } from './template.builder';

@Controller()
export class LetterController {
	constructor(
		private readonly letterService: LetterService,
		private readonly redisService: RedisService,
		private readonly templateBuilder: TemplateBuilder,
	) {}

	@Get()
	async getPage(@Query() query: any): Promise<string> {
		if (query.code !== '뀨잉뀨잉현준') {
			return 'Invalid code parameter';
		}
		const letters = await this.letterService.getLetters();
		const password = await this.redisService.get('password');
		const hideLetters = query.passcode !== password;
		return this.templateBuilder.build(letters, hideLetters);
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
		if (query.code !== '뀨잉뀨잉현준') {
			res.redirect('/');
			return;
		}

		if (!name.trim()) {
			res.redirect('/?code=뀨잉뀨잉현준&message=' + '이름을 작성해주세요');
			return;
		}
		if (!content.trim()) {
			res.redirect('/?code=뀨잉뀨잉현준&message=' + '내용을 작성해주세요');
			return;
		}
		await this.letterService.createLetter({
			name,
			content,
			hidden: hidden === 'true',
		});

		res.redirect('/?code=뀨잉뀨잉현준&message=' + '작성되었습니다.');
	}
}
