const express = require('express');
const router = express.Router();
const { client } = require('../../database');

router.post('/', async (req, res) => {
    try {
        const { user_name, user_email, user_password } = req.body;

        // Проверяем, существует ли пользователь с таким именем или почтой
        const checkQuery = 'SELECT * FROM Users WHERE user_name = $1 OR user_email = $2';
        const checkValues = [user_name, user_email];
        const checkResult = await client.query(checkQuery, checkValues);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ message: 'Пользователь с таким именем или почтой уже существует' });
        }

        // Если пользователь не существует, выполняем запрос на создание
        const insertQuery = 'INSERT INTO Users (user_name, user_email, user_password, role) VALUES ($1, $2, $3, $4) RETURNING *';
        const insertValues = [user_name, user_email, user_password, 'user']; // Добавляем значение роли 'user'
        const result = await client.query(insertQuery, insertValues);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
