
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ResponseDto } from 'common/DTO/response.dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor 
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> 
  {
    return next.handle().pipe(
      map((data) => {

        const message = data && data.message ? data.message : 'Done';

        if ( data.message ) delete data.message;
        
        return new ResponseDto(true, message, data);
      }),
    );
  };
};
