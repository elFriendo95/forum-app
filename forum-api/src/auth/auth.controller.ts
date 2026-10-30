import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard, type JwtPayload } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { UsersService } from '../users/users.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub);
    if (!user) throw new Error('User vanished');
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
