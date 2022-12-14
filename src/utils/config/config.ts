import jwt from 'jsonwebtoken';

export type Configuration = ReturnType<typeof configFactory>;

const APP_NAME = 'client-query-demo-backend';
const ALGO: jwt.Algorithm = 'RS256';

export const configFactory = () => ({
  app: {
    name: APP_NAME,
    port: Number(process.env.PORT) || 5000,
    env: process.env.NODE_ENV || 'development',
    production: process.env.NODE_ENV === 'production',
    home: process.env.BASE_URL!,
    whitelisted_clients: JSON.parse(process.env.WHITELISTED_CLIENTS!) as string[],
  },

  gql: { playground: process.env.GRAPHQL_PLAYGROUND! === 'true' },

  database: {
    mongo_uri: process.env.MONGO_CONNECT_STRING || `mongodb://localhost/${APP_NAME}`,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database_name: APP_NAME,
    redis_uri: process.env.REDIS_TLS_URL || process.env.REDIS_URL || 'redis://localhost:6379',
    redis_labs_uri: process.env.REDIS_LABS_URL,
  },

  auth: {
    jwt: {
      algo: ALGO as jwt.Algorithm,
      RS256PK: process.env.JWT_RS256_PUB_KEY!,
      RS256SK: process.env.JWT_RS256_KEY!,
      expiry: '1h', // Token must be refreshed every hour
    },
    redis: {
      key: process.env.REDIS_LABS_PRIVATE_KEY,
      crt: process.env.REDIS_LABS_CERTICICATE,
    },
    postgres: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  },
});
