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

-- users テーブルの作成
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(45),
    tools INT[],  -- ai_tool_id の配列（外部キー）
    CONSTRAINT fk_tools FOREIGN KEY (tools) REFERENCES ai_tools(ai_tool_id) 
);

-- 初期データの挿入
INSERT INTO users (ip_address, tools) VALUES 
('203.0.113.1', ARRAY[1, 2]),
('203.0.113.2', ARRAY[3, 4]),
('203.0.113.3', ARRAY[5, 6]);
