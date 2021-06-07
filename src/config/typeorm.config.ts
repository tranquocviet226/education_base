import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/permissions/permission.entity';
import { RoleEntity } from 'src/roles/role.entity';
import { UserEntity } from 'src/users/user.entity';

/**
 * Setup default connection in the application
 * @param config {ConfigService}
 */
export const defaultConnection = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.get('TYPEORM_HOST') || 'localhost',
  port: config.get('TYPEORM_PORT') || 3306,
  username: config.get('TYPEORM_USERNAME'),
  password: config.get('TYPEORM_PASSWORD'),
  database: config.get('TYPEORM_DATABASE'),
  entities: [UserEntity, RoleEntity, PermissionEntity],
  autoLoadEntities: config.get('TYPEORM_AUTOLOAD'),
  synchronize: config.get('TYPEORM_SYNCHRONIZE') == 'true',
  logging: config.get('TYPEORM_LOGGING') == 'true',
});
