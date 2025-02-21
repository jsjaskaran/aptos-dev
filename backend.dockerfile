FROM node:18-slim

WORKDIR /home/aptosbot

COPY src /home/aptosbot/src
COPY tsconfig.json /home/aptosbot/
COPY drizzle.config.ts /home/aptosbot/
COPY package.json /home/aptosbot/
COPY yarn.lock /home/aptosbot/

RUN mkdir /home/aptosbot/data
RUN mkdir /home/aptosbot/uploads

RUN yarn install --frozen-lockfile --network-timeout 600000
RUN yarn build

CMD ["yarn", "start"]