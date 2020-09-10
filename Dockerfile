FROM node:14.10.0 AS BUILD_IMAGE
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
WORKDIR /app
COPY . /app
EXPOSE 3000
RUN npm install
RUN npm prune --production
RUN /usr/local/bin/node-prune
FROM node:14-alpine
WORKDIR /app
COPY --from=BUILD_IMAGE /app ./
CMD npm run start