import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import client from './dbClient.js'; 
import getData from './handlers/getdata.js';
import postData from "./handlers/postdata.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// データベースからデータを全取得
app.get("/getdata", (req, res) => getData(client, req, res));

// データベースにデータを追加
app.post('/adddata', (req, res) => postData(client, req, res));

app.get("/", (req, res) => {
  return res.send(`サーバーが http://localhost:${port} で稼働しています`);
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で稼働しています`);
});
