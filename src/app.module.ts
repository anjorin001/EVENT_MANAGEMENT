import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './module/admin/admin.module';
import { AuthModule } from './module/auth/auth.module';
import { EventModule } from './module/events/event.module';
import { PromoterModule } from './module/Promoter/promoter.module';
import { UserModule } from './module/users/user.module';

@Module({
  imports: [
    PromoterModule,
    AuthModule,
    AdminModule,
    EventModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
