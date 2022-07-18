import { Inject, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}

  sign(userData: any) {
    return jwt.sign(userData, this.options.secretKey);
  }
}
