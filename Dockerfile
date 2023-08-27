###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=pptruser:pptruser package*.json ./

RUN npm ci

COPY --chown=pptruser:pptruser . .

USER pptruser

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=pptruser:pptruser package*.json ./

COPY --chown=pptruser:pptruser --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=pptruser:pptruser . .

RUN npm run build

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

RUN npm ci --only=production && npm cache clean --force

USER pptruser

###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY --chown=pptruser:pptruser --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=pptruser:pptruser --from=build /usr/src/app/dist ./dist

RUN apk add --no-cache git
RUN apk add --no-cache python3 py3-pip make g++
# needed for pdfjs-dist
RUN apk add --no-cache build-base cairo-dev pango-dev

# Install Chromium
RUN apk add --no-cache chromium

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
