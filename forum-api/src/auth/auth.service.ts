import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export interface AuthResponse {
  token: string;
  user: Omit<User, 'passwordHash'>;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  private toPublic(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...rest } = user;
    return rest;
  }
  private sign(user: User): string {
    return this.jwtService.sign({ sub: user.id, role: user.role });
  }
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    let user: User;
    try {
      user = await this.userService.create({
        username: dto.username,
        email: dto.email,
        passwordHash: passwordHash,
      });
    } catch (error: any) {
      if (
        typeof error?.code === 'string' &&
        error.code.startsWith('SQLITE_CONSTRAINT')
      ) {
        throw new ConflictException('Email or username already in use');
      }
      throw error;
    }
    return { token: this.sign(user), user: this.toPublic(user) };
  }
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { token: this.sign(user), user: this.toPublic(user) };
  }
}
