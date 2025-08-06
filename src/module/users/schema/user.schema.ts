import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AccountStatus } from 'src/common/enum/account-status';
import { Role } from 'src/common/enum/user-role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: String, enum: AccountStatus })
  accountStatus: AccountStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Event' }] })
  likedEvents: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
