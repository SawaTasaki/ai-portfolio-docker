FROM node:22

WORKDIR /app

# COPY package.json ./
# render.yaml用の設定
COPY ./backend/package.json ./

RUN npm install

COPY . .
# render.yaml用の設定
COPY ./backend/src ./src

CMD ["npm", "start"]
