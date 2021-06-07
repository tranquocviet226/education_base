import { TOKEN_NAME } from '@auth';
import { ApiGlobalResponse } from '@common/decorators';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleRequestDto, RoleResponseDto } from './dtos';
import { RolesService } from './role.service';

@ApiTags('Role Controller')
@ApiBearerAuth(TOKEN_NAME)
// @UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access/roles')
export class RolesController {
  constructor(private RolesService: RolesService) {}

  @ApiOperation({ description: 'Create new role' })
  @ApiGlobalResponse(RoleResponseDto)
  @ApiConflictResponse({ description: 'Role already exists' })
  //   @Permissions('admin.access.roles.create')
  @Post()
  public createRole(
    @Body(ValidationPipe) roleDto: CreateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    return this.RolesService.createRole(roleDto);
  }
}
