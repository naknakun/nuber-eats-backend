import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { UserProfileOutput } from './dtos/user-prfoile.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwt: JwtService,
  ) {}

  getAll(): Promise<User[]> {
    return this.users.find();
  }

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exist = await this.users.findOne({ where: { email } });
      if (exist) {
        //make error
        return { ok: false, error: 'exist email' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      await this.verifications.save(this.verifications.create({ user }));

      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'save error' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({
        where: { email },
        select: ['password', 'id'],
      });
      if (!user) {
        return { ok: false, error: 'not exist email' };
      }
      const correctPassword = await user.checkPassword(password);
      if (!correctPassword) {
        return { ok: false, error: 'not matching password' };
      }
      return {
        ok: true,
        token: this.jwt.sign(user.id),
      };
    } catch (e) {
      return { ok: false, error: 'login error' };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne(id);
      if (!user) {
        throw Error();
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'user not found',
      };
    }
  }

  async editProfile(
    id: number,
    editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      await this.users.update(id, this.users.create({ ...editProfileInput }));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne(
        { code },
        { relations: ['user'] },
      );
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        return {
          ok: true,
        };
      }
      throw new Error();
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }
}
