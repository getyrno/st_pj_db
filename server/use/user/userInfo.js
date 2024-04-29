// userInfo.js

const express = require('express');
const router = express.Router();
const { client } = require('../../database');

router.get('/', async (req, res) => { 
    const sessionToken = req.headers.authorization.split(' ')[1];
    try {
        const query = 'SELECT * FROM sessions JOIN users ON sessions.user_id = users.user_id WHERE session_token = $1';
        const result = await client.query(query, [sessionToken]);
        console.log(result);
        if (result.rows.length > 0) {
            const userInfo = result.rows[0];
            console.log('Информация о пользователе:', userInfo); // Вывод информации о пользователе в консоль сервера
            res.status(200).json(userInfo);
        } else {
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    } catch (error) {
        console.error('Ошибка при проверке сеансового токена:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
