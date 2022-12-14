export { DataResponseFactory } from './data.response.js';

export type Await<T> = T extends Promise<infer U> ? U : never;
export type Constructor<T> = new () => T;
export type Flatten<T> = T extends any[] ? T[number] : T;

export type ID = string | number;

export type Choose<
  T extends Record<string | number, any>,
  K extends string,
> = K extends `${infer U}.${infer Rest}` ? Choose<T[U], Rest> : T[K];

export type DeepProps<
  T extends Record<string | number, any>,
  K extends Exclude<keyof T, symbol> = Exclude<keyof T, symbol>,
  U extends string | number = '',
> = T[K] extends Record<string | number, unknown>
  ?
      | (U extends '' ? K : U)
      | DeepProps<
          T[K],
          Exclude<keyof T[K], symbol>,
          U extends ''
            ? Join<K, Exclude<keyof T[K], symbol>>
            : U | Join<U, Exclude<keyof T[K], symbol>>
        >
  : U;

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

// type Keys = DeepProps<{ app: { game: { lame: number; blame: string; same: { came: string } } } }>;
