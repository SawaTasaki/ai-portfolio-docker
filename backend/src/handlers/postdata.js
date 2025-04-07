const postData = async (client, req, res) => {
  const { tool_name, company } = req.body;

  try {
    const result = await client.query(
      "INSERT INTO ai_tools (tool_name, company) VALUES ($1, $2) RETURNING *",
      [tool_name, company]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.stack });
  }
};

export default postData;
