import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ErrorType } from '@common/enums';
import {
  InvalidCredentialsException,
  DisabledUserException,
} from '@common/exceptions';
import {
  AuthCredentialsRequestDto,
  LoginResponseDto,
  JwtPayload,
} from '../dtos';
import { TokenService } from './token.service';
import { UsersRepository } from 'src/users/user.repository';
import { UserEntity } from 'src/users/user.entity';
import { HashHelper } from 'src/helpers';
import { UserStatus } from 'src/users/user-status.enum';
import { UserMapper } from 'src/users/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private tokenService: TokenService,
  ) {}

  /**
   * User authentication
   * @param authCredentialsDto {AuthCredentialsRequestDto}
   * @returns {Promise<LoginResponseDto>}
   */
  public async login({
    username,
    password,
  }: AuthCredentialsRequestDto): Promise<LoginResponseDto> {
    const user: UserEntity = await this.usersRepository.findUserByUsername(
      username,
    );

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const passwordMatch = await HashHelper.compare(password, user.password);

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }
    if (user.status == UserStatus.Blocked) {
      throw new DisabledUserException(ErrorType.BlockedUser);
    }
    if (user.status == UserStatus.Inactive) {
      throw new DisabledUserException(ErrorType.InactiveUser);
    }

    const payload: JwtPayload = { id: user.id, username: user.username };
    const token = await this.tokenService.generateAuthToken(payload);

    const userDto = await UserMapper.toDto(user);
    const { permissions, roles } = await UserMapper.toDtoWithRelations(user);
    const additionalPermissions = permissions.map(({ slug }) => slug);
    const mappedRoles = roles.map(({ name, permissions }) => {
      const rolePermissions = permissions.map(({ slug }) => slug);
      return {
        name,
        permissions: rolePermissions,
      };
    });

    return {
      user: userDto,
      token,
      access: {
        additionalPermissions,
        roles: mappedRoles,
      },
    };
  }
}
