FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .

RUN yarn build

WORKDIR /app/build
RUN yarn install --production

CMD yarn start