# Build
FROM node:16-alpine AS development
WORKDIR /root/demo_backend
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:16-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /root/demo_backend
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY ./.cert ./.cert
COPY --from=development /root/demo_backend/dist ./dist
EXPOSE 5000
CMD ["yarn", "start:prod"]