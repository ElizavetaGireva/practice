FROM node:18 AS builder
WORKDIR /app
COPY package.json ./
RUN npm i --force && npm ci --force && \
    npm cache clean --force && \
    rm -rf /tmp/*

COPY .. .
RUN npm run build

# Стадия развертывания с Nginx
FROM caddy:alpine AS runner

RUN apk --no-cache add tini git openssh-client bash \
    && apk --no-cache add --virtual devs curl tar coreutils gnupg && apk del devs

# Copy over a default Caddyfile
COPY --from=builder /app/dist /var/www/html
COPY ./infra/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

ENTRYPOINT ["/sbin/tini", "--"]
RUN caddy fmt --overwrite /etc/caddy/Caddyfile
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

