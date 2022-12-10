import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Letter {
	@Prop({ type: String })
	name!: string;

	@Prop({ type: String })
	content!: string;

	@Prop({ type: String })
	createdAt!: string; // yyyy-MM-dd

	@Prop({ type: Boolean })
	sended!: boolean;

	@Prop({ type: Boolean })
	hidden!: boolean;
}

export const LetterSchema = SchemaFactory.createForClass(Letter);
