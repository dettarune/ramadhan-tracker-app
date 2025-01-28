import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express'; 

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: Request = context.switchToHttp().getRequest();

      const authHeader = req.cookies['Authorization']

      if(!authHeader)
        throw new UnauthorizedException('Invalid token');  
      
      const verified = await this.jwtService.verifyAsync(authHeader);
      if (!verified) 
        throw new UnauthorizedException('Invalid token');  
      
      return true;
    } catch (error) {
      console.error('AuthGuard Error:', error.message);
  
      throw new UnauthorizedException('Invalid or expired token');
    }
  
  
  }
}