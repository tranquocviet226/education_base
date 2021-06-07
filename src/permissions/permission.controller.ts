import {
  //   JwtAuthGuard,
  //   Permissions,
  //   PermissionsGuard,
  //   SuperUserGuard,
  TOKEN_NAME,
} from '@auth';
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
import { CreatePermissionRequestDto, PermissionResponseDto } from './dtos';
import { PermissionsService } from './permission.service';

@ApiTags('Permissions')
@ApiBearerAuth(TOKEN_NAME)
// @UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access/permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @ApiOperation({ description: 'Create new permission' })
  @ApiGlobalResponse(PermissionResponseDto)
  @ApiConflictResponse({ description: 'Permission already exists' })
  //   @UseGuards(SuperUserGuard)
  //   @Permissions('admin.access.permissions.create')
  @Post()
  public createPermission(
    @Body(ValidationPipe) permissionDto: CreatePermissionRequestDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionsService.createPermission(permissionDto);
  }
}
