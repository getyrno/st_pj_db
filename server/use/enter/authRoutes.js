// authRoutes.js

const express = require('express');
const router = express.Router();
const { client } = require('../../database');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
    try {
        const { login_name, login_password } = req.body;
        const query = 'SELECT user_id, user_name, user_email, user_password FROM users WHERE user_name = $1 AND user_password = $2';
        const values = [login_name, login_password];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            const sessionToken = uuidv4();
            const insertSessionQuery = 'INSERT INTO sessions (user_id, session_token) VALUES ($1, $2)';
            const insertSessionValues = [result.rows[0].user_id, sessionToken];
            await client.query(insertSessionQuery, insertSessionValues);

            // Сохраняем информацию о пользователе в сессии
            req.session.user = { id: result.rows[0].user_id, name: result.rows[0].user_name };

            res.status(200).json({ sessionToken });
            console.log('Информация о пользователе сохранена в сессии:', req.session.user);
        } else {
            res.status(401).json({ error: 'Неправильное имя пользователя или пароль' });
        }
    } catch (error) {
        console.error('Ошибка при аутентификации пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
