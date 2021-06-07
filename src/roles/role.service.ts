import { DBErrorCode } from '@common/enums';
import {
  ForeignKeyConflictException,
  RoleExistsException,
} from '@common/exceptions';
import {
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeoutError } from 'rxjs';
import { CreateRoleRequestDto, RoleResponseDto } from './dtos';
import { RoleMapper } from './role.mapper';
import { RolesRepository } from './role.repository';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository)
    private rolesRepository: RolesRepository,
  ) {}

  /**
   * Create new role
   * @param roleDto {CreateRoleRequestDto}
   * @returns {Promise<RoleResponseDto>}
   */
  public async createRole(
    roleDto: CreateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    try {
      let roleEntity = RoleMapper.toCreateEntity(roleDto);
      roleEntity = await this.rolesRepository.save(roleEntity);
      return RoleMapper.toDto(roleEntity);
    } catch (error) {
      if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new RoleExistsException(roleDto.name);
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
