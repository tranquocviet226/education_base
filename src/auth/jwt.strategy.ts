import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './dtos';
import {
  DisabledUserException,
  InvalidCredentialsException,
} from '@common/exceptions';
import { ErrorType } from '@common/enums';
import { UsersRepository } from 'src/users/user.repository';
import { UserEntity } from 'src/users/user.entity';
import { UserStatus } from 'src/users/user-status.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private consigService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: consigService.get('TOKEN_SECRET'),
    });
  }

  async validate({ username }: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    if (user.status == UserStatus.Inactive) {
      throw new DisabledUserException(ErrorType.InactiveUser);
    }
    if (user.status == UserStatus.Blocked) {
      throw new DisabledUserException(ErrorType.BlockedUser);
    }
    return user;
  }
}
