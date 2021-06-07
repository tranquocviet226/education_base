import { ErrorType } from '@common/enums';
import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super({ errorType: ErrorType.InvalidToken });
  }
}
