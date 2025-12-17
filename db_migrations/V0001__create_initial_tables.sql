-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица категорий
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50)
);

-- Таблица событий
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255),
    participants_count INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сообществ
CREATE TABLE IF NOT EXISTS communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    members_count INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица избранных событий пользователя
CREATE TABLE IF NOT EXISTS user_favorites (
    user_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, event_id)
);

-- Таблица участия в сообществах
CREATE TABLE IF NOT EXISTS community_members (
    user_id INTEGER REFERENCES users(id),
    community_id INTEGER REFERENCES communities(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, community_id)
);

-- Таблица регистрации на события
CREATE TABLE IF NOT EXISTS event_registrations (
    user_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, event_id)
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_communities_category ON communities(category_id);

-- Наполнение категорий
INSERT INTO categories (name, icon) VALUES
    ('спорт', 'Dumbbell'),
    ('творчество', 'Palette'),
    ('образование', 'GraduationCap'),
    ('развлечения', 'PartyPopper'),
    ('музыка', 'Music'),
    ('технологии', 'Laptop')
ON CONFLICT (name) DO NOTHING;