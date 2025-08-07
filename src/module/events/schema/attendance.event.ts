import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AttendanceDocument = HydratedDocument<Attendance>;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true })
  eventId: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
