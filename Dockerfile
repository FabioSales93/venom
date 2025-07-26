FROM node:20-bullseye

RUN apt-get update && apt-get install -y chromium \
  fonts-liberation libatk-bridge2.0-0 libgtk-3-0 libnss3 libx11-xcb1 \
  libxcomposite1 libxdamage1 libxrandr2 xdg-utils && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 \
    CHROME_BIN=/usr/bin/chromium \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage"


CMD ["node", "index.js"]
