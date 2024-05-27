const express = require('express');
const router = express.Router();
const { client } = require('../../database'); // Подключение к базе данных

// Получение всех кейсов
router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM cases');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Добавление нового кейса
router.post('/add', async (req, res) => {
    const { videoNum, courseId } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO cases (video_num, course_id) VALUES ($1, $2) RETURNING *',
            [videoNum, courseId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Удаление кейса
router.delete('/delete/:caseId', async (req, res) => {
    const { caseId } = req.params;
    try {
        await client.query('DELETE FROM cases WHERE case_id = $1', [caseId]);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
