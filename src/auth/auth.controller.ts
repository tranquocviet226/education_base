import { Get } from '@nestjs/common';

export class AuthController {
  @Get()
  getHello() {
    return 'Hello';
  }
}
