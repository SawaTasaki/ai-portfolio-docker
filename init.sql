-- ai_tools テーブルの作成
CREATE TABLE IF NOT EXISTS ai_tools (
    ai_tool_id SERIAL PRIMARY KEY,
    tool_name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL
);

-- 初期データの挿入
INSERT INTO ai_tools (tool_name, company) VALUES
('ChatGPT-4.0', 'OpenAI'),
('Grok 3.0', 'xAI'),
('Copilot', 'Microsoft'),
('Claude', 'Anthropic'),
('Devin', 'Cogintion'),
('Cursor', 'Anysphere');

-- userテーブルの作成
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    favorite_tools INTEGER[]  -- 使用ツールのリスト（最大25個まで）
);

-- 初期データの挿入
INSERT INTO users (email, password, favorite_tools) VALUES
('user1@example.com', 'password123', ARRAY[1, 2]),
('user2@example.com', 'password123', ARRAY[3, 4]),
('user3@example.com', 'password123', ARRAY[5, 6, 1]);
