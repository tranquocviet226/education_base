import { PermissionEntity } from '../permissions/permission.entity';
import { RoleEntity } from '../roles/role.entity';
import { CreateUserRequestDto, UserResponseDto } from './dtos';
import { UserStatus } from './user-status.enum';
import { UserEntity } from './user.entity';

export class UserMapper {
  public static async toDto(entity: UserEntity): Promise<UserResponseDto> {
    const dto = new UserResponseDto();

    dto.id = entity.id;
    dto.username = entity.username;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.status = entity.status;
    dto.isSuperUser = entity.isSuperUser;
    return dto;
  }

  public static toCreateEntity(dto: CreateUserRequestDto): UserEntity {
    const entity = new UserEntity();
    entity.username = dto.username;
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.password = dto.password;
    entity.permissions = Promise.resolve(
      dto.permissions.map((id) => new PermissionEntity({ id })),
    );
    entity.roles = Promise.resolve(
      dto.roles.map((id) => new RoleEntity({ id })),
    );
    entity.status = UserStatus.Active;
    entity.isSuperUser = false;
    return entity;
  }
}
