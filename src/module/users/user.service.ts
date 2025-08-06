import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountStatus } from 'src/common/enum/account-status';
import { Role } from 'src/common/enum/user-role.enum';
import { SignupDto } from '../auth/dto/signup.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: SignupDto) {
    const user = await this.userModel.create({
      name: data.name,
      email: data.email,
      accountStatus: data.accountStatus,
      password: data.password,
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async findById(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();
    return user;
  }

  async addEventToUser(eventId: string, userId: string) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { likedEvents: eventId } },
        { new: true },
      )
      .select('-password');

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async getPendingUsers() {
    return await this.userModel.find({ accountStatus: AccountStatus.PENDING });
  }

  async approveUser(id: string) {
    const user = await this.userModel.findOneAndUpdate(
      {
        id,
        accountStatus: AccountStatus.PENDING,
      },
      { accountStatus: AccountStatus.APPROVED },
      { new: true },
    );
    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  async rejectUser(id: string) {
    const user = await this.userModel.findOneAndUpdate(
      {
        id,
        accountStatus: AccountStatus.PENDING,
      },
      { accountStatus: AccountStatus.REJECTED, role: Role.USER },
      { new: true },
    );
    if (!user) throw new NotFoundException('user not found');

    return user;
  }
}
