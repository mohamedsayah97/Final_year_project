import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JWTPayloadType } from 'src/utils/types';

type RequestWithUser = Request & { user?: JWTPayloadType };

//CurrentUser parameter decorator
export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const payload: JWTPayloadType | undefined = request.user;
    return payload;
  },
);
