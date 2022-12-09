FROM node:16-alpine3.14
LABEL version="0.0.1"

RUN npm install --location=global pnpm@^7

# COPY repository
COPY . .

# build
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Start
ENTRYPOINT [ "pnpm", "run", "start:prod" ]
