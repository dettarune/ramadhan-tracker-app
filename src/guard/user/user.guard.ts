import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
  
      const tokenHeader = req.header('Authorization');
      if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Authorization header is missing or invalid');
      }
  
      const token = tokenHeader.split(' ')[1];

      const tokenPayload = this.jwtService.verify(token);
  
      if (!tokenPayload || !tokenPayload.username || !tokenPayload.role) {
        throw new UnauthorizedException('Invalid token payload');
      }
      
      const now = Date.now(); 
      if (tokenPayload.exp * 1000 < now) { 
          throw new UnauthorizedException('Token has expired'); 
      }
      
      req.user = tokenPayload;
  
      return true;
    } catch (error) {
      console.error('AuthGuard Error:', error.message);
  
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
  
      throw new UnauthorizedException('Invalid or expired token');
    }
  
  
  }
}