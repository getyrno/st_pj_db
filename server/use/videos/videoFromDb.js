const express = require('express');
const router = express.Router();
const { client } = require('../../database');

// Получение списка существующих видео
router.get('/', async (req, res) => {
    try {
        // Запрос к базе данных для получения списка видео
        const query = 'SELECT * FROM videos';
        const result = await client.query(query);

        // Отправка списка видео в формате JSON
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

module.exports = router;
