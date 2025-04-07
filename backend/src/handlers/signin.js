import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const signin = async (client, req, res) => {
  const { email, password } = req.body;

  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "ユーザーが見つかりません。" });
    }
    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "無効なパスワードです。" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      message: "ログイン成功です。",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ error: err.stack });
  }
};

export default signin;
