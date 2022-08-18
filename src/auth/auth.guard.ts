import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const sqlContext = GqlExecutionContext.create(context).getContext();
    const user = sqlContext['user'];
    if (!user) {
      return false;
    }
    return true;
  }
}
