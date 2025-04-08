const saveData = async (client, req, res) => {
  const ip_address = req.ip;
  const { tools } = req.body;
  console.log("eee", ip_address, tools);

  try {
    const result = await client.query(
      "INSERT INTO users (ip_address, tools) VALUES ($1, $2) RETURNING *",
      [ip_address, tools]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('ユーザーデータ保存中のエラー:', err.stack);
    return res.status(500).json({ error: 'ユーザーデータの保存中にエラーが発生しました。' });
  }
};

export default saveData;
