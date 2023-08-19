###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:lts-bullseye As development

WORKDIR /usr/src/app

COPY --chown=pptruser:pptruser package*.json ./

RUN npm ci

COPY --chown=pptruser:pptruser . .

USER pptruser

###################
# BUILD FOR PRODUCTION
###################

FROM node:lts-bullseye As build

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y --no-install-recommends wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update
RUN apt-get install -y --no-install-recommends fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 ca-certificates fonts-liberation libayatana-appindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc-s1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxtst6 lsb-release wget xdg-utils \
    && rm -rf /var/lib/apt/lists/* \
    && npm i puppeteer \
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && chown -R pptruser:pptruser /usr/src/app \
    && mkdir -p /home/pptruser \
    && chown -R pptruser:pptruser /home/pptruser \
    && mkdir -p /whatsapp-data \
    && chown -R pptruser:pptruser /whatsapp-data \
    && chown -R pptruser:pptruser /usr/src/app/node_modules

COPY --chown=pptruser:pptruser package*.json ./

COPY --chown=pptruser:pptruser --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=pptruser:pptruser . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER pptruser

###################
# PRODUCTION
###################

FROM node:lts-bullseye As production

COPY --chown=pptruser:pptruser --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=pptruser:pptruser --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/src/main.js" ]
