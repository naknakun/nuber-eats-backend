import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const sqlContext = GqlExecutionContext.create(ctx).getContext();
    const user = sqlContext['user'];
    return user;
  },
);
