import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();

      const authHeader = req.cookies['Authorization']

      if (!authHeader)
        throw new UnauthorizedException('User Not Authorize');

      const verified = await this.jwtService.verifyAsync(authHeader, {secret: process.env.SECRET_JWT});
      if (!verified)
        throw new UnauthorizedException('User Not Authorize');

      req['user'] = verified;
      return true;
    } catch (error) {
      console.error('AuthGuard Error:', error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }

  }
}