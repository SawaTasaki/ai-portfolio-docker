const postData = async (client, req, res) => {
  const { tool_name, company } = req.body;

  if (typeof tool_name !== "string" || typeof company !== "string") {
    return res.status(400).json({ error: "無効な入力データです" });
  }

  try {
    const result = await client.query(
      "INSERT INTO ai_tools (tool_name, company) VALUES ($1, $2) RETURNING *",
      [tool_name, company]
    );

    if (result.rows.length === 0) {
      return res.status(500).json({ error: "データの挿入に失敗しました" });
    }

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "内部サーバーエラー" });
  }
};

export default postData;
