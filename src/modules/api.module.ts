import { Module } from '@nestjs/common';

import { LetterModule } from './letter';

@Module({
	imports: [LetterModule],
})
export class ApiModule {}
