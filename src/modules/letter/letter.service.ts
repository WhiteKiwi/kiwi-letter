import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Letter } from './letter.entity';

@Injectable()
export class LetterService {
	constructor(
		@InjectModel(Letter.name)
		private readonly letterModel: Model<Letter>,
	) {}

	async getLetters(): Promise<Letter[]> {
		return await this.letterModel.find({
			// object id로 정렬하면 최신순으로 정렬됨
			$sort: { _id: -1 },
			// TODO: Paging or infinite scroll
			$size: 50,
		});
	}

	async createLetter({
		name,
		content,
		hidden,
	}: {
		name: string;
		content: string;
		hidden: boolean;
	}): Promise<void> {
		await this.letterModel.create({
			name,
			content: content.replace(/</g, '&lt;'),
			createdAt: dateToYyyyMMdd(new Date()),
			sended: false,
			hidden,
		});
	}
}

function dateToYyyyMMdd(date: Date) {
	const year = date.getFullYear();
	const month = ('0' + (1 + date.getMonth())).slice(-2);
	const day = ('0' + date.getDate()).slice(-2);

	return [year, month, day].join('-');
}
