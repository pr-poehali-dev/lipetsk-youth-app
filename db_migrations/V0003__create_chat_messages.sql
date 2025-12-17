-- Таблица сообщений для общего чата
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    username VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрой сортировки по времени
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Добавляем тестового пользователя для демонстрации
INSERT INTO users (username, email) VALUES
    ('guest', 'guest@lipetsk.live')
ON CONFLICT (username) DO NOTHING;

-- Добавляем приветственные сообщения
INSERT INTO chat_messages (user_id, username, message, created_at) VALUES
    (1, 'Администратор', 'Добро пожаловать в общий чат Липецк Live! 🚀', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    (1, 'Администратор', 'Здесь можно обсудить события, найти единомышленников и договориться о встречах!', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
    (1, 'Аня', 'Привет всем! Кто-нибудь идет на граффити мастер-класс в субботу?', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
    (1, 'Максим', 'Я буду! Встретимся там 🎨', CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
    (1, 'Даша', 'Ищу компанию для бега по утрам, кто со мной? 🏃', CURRENT_TIMESTAMP - INTERVAL '5 minutes');
