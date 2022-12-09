import { Injectable } from '@nestjs/common';

@Injectable()
export class LetterService {
	async createLetter({}: { name: string; content: string }): Promise<void> {}
}
