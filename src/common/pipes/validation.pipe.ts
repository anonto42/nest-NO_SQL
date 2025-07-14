import { Injectable, PipeTransform, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(
    private readonly whitelist: boolean = true,
    private readonly forbidNonWhitelisted: boolean = true,
    private readonly transformEnabled: boolean = true
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    // Pass options to the validate function
    const errors = await validate(value, {
      whitelist: this.whitelist,
      forbidNonWhitelisted: this.forbidNonWhitelisted,
      transform: this.transformEnabled,
    });

    if (errors.length > 0) {
      const firstError = errors[0];
      const message = firstError.constraints
        ? Object.values(firstError.constraints)[0]
        : 'Validation failed';
      throw new BadRequestException(message);
    }

    return value;
  }
}