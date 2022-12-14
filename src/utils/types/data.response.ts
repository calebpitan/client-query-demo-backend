import { ApiProperty } from '@nestjs/swagger';
import type { Constructor } from './index.js';

export interface DataResponseFactoryOptions {
  isArray?: boolean;
  namespace?: string;
}

export function DataResponseFactory<T extends Constructor<any>>(
  constr: T,
  options?: DataResponseFactoryOptions,
) {
  options = Object.assign({}, { isArray: false, namespace: constr.name }, options);

  const { namespace, isArray } = options;

  const name = `${namespace}${isArray ? 's' : ''}`;

  class Data<R> {
    @ApiProperty({ name: name.toLowerCase(), type: () => constr, isArray })
    field!: R;
  }

  Object.defineProperty(Data<T>, 'name', { value: name.concat(Data.name) });

  class DataResponse<R extends Constructor<R> = T> {
    @ApiProperty({ type: () => Data<R> })
    data!: Data<R>;

    @ApiProperty({ nullable: true, required: false })
    message?: string;

    @ApiProperty({ nullable: true, required: false })
    success?: boolean;
  }

  Object.defineProperty(DataResponse<T>, 'name', { value: name.concat(DataResponse.name) });

  return DataResponse<T>;
}
