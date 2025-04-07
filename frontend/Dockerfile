# 使用するNode.jsのバージョンを指定
FROM node:22

# アプリケーションの作業ディレクトリを作成
WORKDIR /app

# フロントエンドの依存関係をインストールするためにpackage.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# 開発サーバーを起動するコマンド
CMD ["npm", "run", "dev"]
