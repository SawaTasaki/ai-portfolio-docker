import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import client from './dbClient.js'; 
import getData from './handlers/getdata.js';
import postData from "./handlers/postdata.js";
import signup from "./handlers/signup.js";
import signin from "./handlers/signin.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// データベースからデータを全取得
app.get("/getdata", (req, res) => getData(client, req, res));

// データベースにデータを追加
app.post('/adddata', (req, res) => postData(client, req, res));

// サインアップ
// app.post('/signup', (req, res) => signup(client, req, res));

// サインイン
// app.post('/signin', (req, res) => signin(client, req, res));

app.get("/", (req, res) => {
  return res.send(`サーバーが PORT ${port} で稼働しています`);
});

app.listen(port, () => {
  console.log(`サーバーが PORT ${port} で稼働しています`);
});
