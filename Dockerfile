FROM node:16-alpine

RUN apk add --no-cache chromium-browser

WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

WORKDIR /app/build
RUN yarn install --production

CMD yarn start