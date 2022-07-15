import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.users.find();
  }

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const exist = await this.users.findOne({ where: { email } });
      if (exist) {
        //make error
        return { ok: false, error: 'exist email' };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'save error' };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.users.findOne({
        where: { email },
      });
      if (!user) {
        return { ok: false, error: 'not exist email' };
      }
      const correctPassword = await user.checkPassword(password);
      if (!correctPassword) {
        return { ok: false, error: 'not matching password' };
      }
      return { ok: true, token: 'asd' };
    } catch (e) {
      return { ok: false, error: 'login error' };
    }
  }
}
