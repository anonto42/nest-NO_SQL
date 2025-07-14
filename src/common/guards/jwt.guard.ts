import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Authentication logic (e.g., check JWT token)
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    
    // Mock check for token (you would verify the JWT here)
    if (token === 'valid-jwt-token') {
      return true;
    }
    return false;
  }
}
