import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import client from './dbClient.js'; 
import getData from './handlers/getdata.js';
import postData from "./handlers/postdata.js";
import saveData from "./handlers/savedata.js";

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

// データベースにデータを保存
app.post("/savedata", (req, res) => saveData(client, req, res));

app.get("/", (req, res) => {
  return res.send(`サーバーがポート ${port} で稼働しています`);
});

app.listen(port, () => {
  console.log(`サーバーがポート ${port} で稼働しています`);
});
