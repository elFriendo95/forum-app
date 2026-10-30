import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
export interface JwtPayload {
  sub: number;
  role: 'user' | 'admin';
}
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }
    const token = header.slice('Bearer '.length);
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      req.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
