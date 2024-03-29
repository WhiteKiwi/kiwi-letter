import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model, Types } from 'mongoose';
import { TheCampClient } from 'the-camp';
import { Env } from '../../config/env';
import { RedisService } from '../../core';
import { Letter } from './letter.entity';

@Injectable()
export class LetterBatchService {
	constructor(
		@InjectModel(Letter.name)
		private readonly letterModel: Model<Letter>,
		private readonly configService: ConfigService<Env>,
		private readonly redisService: RedisService,
	) {}

	@Cron('0 0 * * * *')
	async registerSoldier(): Promise<void> {
		console.log('registerSoldier');

		const [id, password] = this.configService
			.get('THE_CAMP_CREDENTIAL', ':')
			.split(':');
		const theCampClient = new TheCampClient({ id, password });

		try {
			const { soldierId } = await theCampClient.registerSoldier({
				성분: '예비군인/훈련병',
				군종: '육군',
				이름: '이현준',
				입영부대: '육군훈련소-논산',
				관계: '팬',
				생년월일: '2001-11-17',
				입영일: '2023-03-02',
				전화번호: '01029602307',
			});
			await this.redisService.set('soldierId', soldierId);
		} catch (e) {
			console.error(e);
		}
	}

	@Cron('10 0 * * * *')
	async batchLetters(): Promise<void> {
		console.log('batchLetters');

		const soldierId = await this.redisService.get('soldierId');
		if (!soldierId) {
			console.log('soldierId is not exist');
			return;
		}
		const letters = await this.letterModel.find({
			sended: false,
		});

		const [id, password] = this.configService
			.get('THE_CAMP_CREDENTIAL', ':')
			.split(':');
		const theCampClient = new TheCampClient({ id, password });

		for (const letter of letters) {
			await this.sendLetter(theCampClient, soldierId, letter).catch((e) => {
				console.error(e);
			});
		}
	}

	private async sendLetter(
		theCampClient: TheCampClient,
		soldierId: string,
		letter: Letter & { _id: Types.ObjectId },
	): Promise<void> {
		await theCampClient.sendLetter(soldierId, {
			제목: '이현준-인편게시판',
			작성자: letter.name,
			내용: letter.content + '\n<br>작성일: ' + letter.createdAt,
		});
		await this.letterModel.updateOne(
			{
				_id: letter._id,
			},
			{
				sended: true,
			},
		);
	}
}
