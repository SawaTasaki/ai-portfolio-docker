FROM node:22

WORKDIR /app

# COPY package.json ./
# render.yaml用の設定
COPY ./frontend/package.json ./

RUN npm install

# COPY . .
# render.yaml用の設定
COPY ./frontend ./

CMD ["npm", "run", "dev"]
