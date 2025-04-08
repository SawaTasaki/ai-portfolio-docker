const saveData = async (client, req, res) => {
  // const ip_address = req.ip;
  
  // X-Forwarded-For ヘッダーからIPを取得
  const xip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // X-Forwarded-Forには複数のIPアドレスがカンマ区切りで含まれている場合があるので最初のIPを取得
  const ip_address = xip.split(',')[0];

  const { tools } = req.body;

  try {
    const result = await client.query(
      "INSERT INTO users (ip_address, tools) VALUES ($1, $2) RETURNING *",
      [ip_address, tools]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "内部サーバーエラー" });
  }
};

export default saveData;
