const express = require('express');
const router = express.Router();
const { client } = require('../../database'); // Подключение к базе данных

// Запись истории
router.post('/', async (req, res) => {
  const { video_id, course_id, user_id } = req.body;
  const watch_date = new Date();

  try {
    await client.query(
      'INSERT INTO history (video_id, course_id, watch_date, user_id) VALUES ($1, $2, $3, $4)',
      [video_id, course_id, watch_date, user_id]
    );
    res.status(201).send('History logged');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/checkuser', async (req, res) => {
  const sessionToken = req.headers.authorization.split(' ')[1];
  try {
      const query = 'SELECT users.user_id FROM sessions JOIN users ON sessions.user_id = users.user_id WHERE session_token = $1';
      const result = await client.query(query, [sessionToken]);

      if (result.rows.length > 0) {
          const userId = result.rows[0].user_id;
          console.log('Имя пользователя:', userId); // Выводим имя пользователя в консоль сервера
          res.status(200).json({ userId });
      } else {
          res.status(401).json({ error: 'Неправильный сеансовый токен' });
      }
  } catch (error) {
      console.error('Ошибка при проверке сеансового токена:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
  }
});


router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await client.query(
      'SELECT h.history_id, h.watch_date, v.video_name, v.video_description, c.course_name FROM history h JOIN videos v ON h.video_id = v.video_id JOIN courses c ON h.course_id = c.course_id WHERE h.user_id = $1 ORDER BY h.watch_date DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
