import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EventStatus } from 'src/common/enum/event.enum';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: String, required: true })
  startTime: string;

  @Prop({ type: String, required: true })
  endTime: string;

  @Prop({ type: String, enum: EventStatus })
  eventStatus: EventStatus;

  @Prop({ type: Number, required: true })
  availableSeats: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
