import bcrypt from "bcrypt";

const signup = async (client, req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "メールアドレスとパスワードは必須です。" });
  }

  const existingUser = await client.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (existingUser.rows.length > 0) {
    return res
      .status(400)
      .json({ message: "そのメールアドレスは既に使用されています。" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await client.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    return res.status(201).json({
      message: "ユーザーが正常に作成されました。",
      user: result.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ error: err.stack });
  }
};

export default signup;
