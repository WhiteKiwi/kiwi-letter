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
	getPage(): string {
		return this.templateBuilder.build([
			{
				name: '장지훈',
				content: '안녕하세요',
				createdAt: '2022-01-01',
				sended: false,
			},
			{
				name: '장지훈',
				content: '안녕하세요',
				createdAt: '2022-01-01',
				sended: true,
			},
		]);
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
