import { ApiProperty } from '@nestjs/swagger';

export interface ErrorResponseFactoryOptions {
  message?: string;
  statusCode?: number;
}

export function ErrorResponseFactory({ message, statusCode }: ErrorResponseFactoryOptions = {}) {
  class ErrorResponse {
    @ApiProperty({ description: 'A descriptive error message', example: message })
    message!: string;

    @ApiProperty({ description: 'A specific HTTP status code for this error', example: statusCode })
    statusCode!: number;

    @ApiProperty({
      description: 'A generic error description',
      examples: ['Bad Request', 'Not Found', 'Forbidden', 'Unauthenticated'],
    })
    error!: string;
  }

  return ErrorResponse;
}

export class BadRequestErrorResponse extends ErrorResponseFactory({
  message: 'Bad user input please check data and reform',
  statusCode: 400,
}) {}

export class NotFoundErrorResponse extends ErrorResponseFactory({
  message: 'Resource not found!',
  statusCode: 404,
}) {}
