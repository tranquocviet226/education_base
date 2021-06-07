import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { defaultConnection } from '@config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { RolesModule } from './roles/role.module';
import { PermissionsModule } from './permissions/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: defaultConnection,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    RolesModule,
    PermissionsModule,
  ],
})
export class AppModule {}
