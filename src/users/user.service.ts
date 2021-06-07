import {
  InternalServerErrorException,
  RequestTimeoutException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashHelper } from 'src/helpers';
import { UserResponseDto } from './dtos';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UserMapper } from './user.mapper';
import { UsersRepository } from './user.repository';
import { DBErrorCode } from '@common/enums';
import { TimeoutError } from 'rxjs';
import {
  ForeignKeyConflictException,
  UserExistsException,
} from '@common/exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  /**
   * Create new user
   * @param userDto {CreateUserRequestDto}
   * @returns {Promise<UserResponseDto>}
   */
  public async createUser(
    userDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    try {
      let userEntity = UserMapper.toCreateEntity(userDto);
      userEntity.password = await HashHelper.encrypt(userEntity.password);
      userEntity = await this.usersRepository.save(userEntity);
      return UserMapper.toDto(userEntity);
    } catch (error) {
      if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new UserExistsException(userDto.username);
      }
      if (
        error.code == DBErrorCode.PgForeignKeyConstraintViolation ||
        error.code == DBErrorCode.PgNotNullConstraintViolation
      ) {
        throw new ForeignKeyConflictException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
