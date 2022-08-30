import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

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
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
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
      return {
        ok: true,
        token: this.jwt.sign(user.id),
      };
    } catch (e) {
      return { ok: false, error: 'login error' };
    }
  }

  async findById(id: number): Promise<User> {
    return this.users.findOne(id);
  }

  async editProfile(id: number, editProfileInput: EditProfileInput) {
    return await this.users.update(
      id,
      this.users.create({ ...editProfileInput }),
    );
  }
}
