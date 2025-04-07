const getData = async (client, req, res) => {
  try {
    const result = await client.query("SELECT * FROM ai_tools");
    if (result.rows.length > 0) {
      return res.json(result.rows);
    } else {
      return res
        .status(404)
        .json({ message: "データが見つかりませんでした。" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.stack });
  }
};

export default getData;
