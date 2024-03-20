FROM debian:11.6-slim as builder

WORKDIR /app

RUN apt update && \
    apt install curl unzip -y && \
    curl https://bun.sh/install | bash

RUN curl https://bun.sh/install | bash

COPY package.json .
COPY bun.lockb .

RUN /root/.bun/bin/bun install --production

##########################
FROM node:20.10

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY prisma ./prisma/
COPY --from=builder /root/.bun/bin/bun bun
COPY --from=builder /app/node_modules node_modules
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

COPY src src
COPY tsconfig.json .

ENV NODE_ENV production

RUN apt update && apt install -y netcat-openbsd
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["./bun", "src/index.ts"]

EXPOSE ${PORT} ${WS_PORT}