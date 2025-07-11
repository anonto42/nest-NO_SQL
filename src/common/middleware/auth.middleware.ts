import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UtilsService } from 'src/common/utils/utils.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly utilsService: UtilsService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Extract the token from the Authorization header
    const token = req.headers.authorization;

    if (!token) {
      // If no token, return Unauthorized error
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      // Check if the token is in Bearer format
      if (token && token.startsWith('Bearer')) {
        // Extract the JWT token
        const jwtToken = token.split(' ')[1];

        // Use your utility service to verify the JWT token
        const decoded = this.utilsService.verifyJwtToken(jwtToken);

        // Attach the decoded user to the request object (optional)
        //@ts-ignore
        req.user = decoded;

        // Role guard: Check if roles are provided and if user has the necessary role
        const roles = req['roles'];
        if (roles && roles.length > 0 && !roles.includes(decoded.role)) {
          // If roles don't match, throw Forbidden error
          throw new HttpException(
            "You don't have permission to access this API",
            HttpStatus.FORBIDDEN,
          );
        }
      }

      next();
    } catch (error) {
      throw new HttpException(error.message || 'Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
