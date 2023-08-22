###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM ghcr.io/puppeteer/puppeteer:latest As development

WORKDIR /usr/src/app

COPY --chown=pptruser:pptruser package*.json ./

RUN npm ci

COPY --chown=pptruser:pptruser . .

USER pptruser

###################
# BUILD FOR PRODUCTION
###################

FROM ghcr.io/puppeteer/puppeteer:latest As build

WORKDIR /usr/src/app

COPY --chown=pptruser:pptruser package*.json ./

COPY --chown=pptruser:pptruser --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=pptruser:pptruser . .

RUN npm run build

ENV NODE_ENV=production

RUN npm ci --only=production && npm cache clean --force

USER pptruser

###################
# PRODUCTION
###################

FROM ghcr.io/puppeteer/puppeteer:latest As production

COPY --chown=pptruser:pptruser --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=pptruser:pptruser --from=build /usr/src/app/dist ./dist

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
