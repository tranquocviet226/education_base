import { ApiGlobalResponse } from '@common/decorators';
import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ApiConflictResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dtos';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UserService } from './user.service';

@ApiTags('User Controller')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ description: 'Create new user' })
  @ApiGlobalResponse(UserResponseDto)
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiGlobalResponse(UserResponseDto)
  // @Permissions('admin.access.users.create')
  @Post()
  public createUser(
    @Body(ValidationPipe) userDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(userDto);
  }
}
