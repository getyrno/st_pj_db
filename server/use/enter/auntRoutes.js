const express = require('express');
const router = express.Router();
const { client } = require('../../database');

router.get('/', async (req, res) => {
  const sessionToken = req.headers.authorization.split(' ')[1];
  try {
      const query = 'SELECT users.user_name FROM sessions JOIN users ON sessions.user_id = users.user_id WHERE session_token = $1';
      const result = await client.query(query, [sessionToken]);

      if (result.rows.length > 0) {
          const username = result.rows[0].user_name;
          res.status(200).json({ username });
          console.log('Информация о пользователе:', { username }); // Вывод информации о пользователе в консоль сервера
      } else {
          res.status(401).json({ error: 'Неправильный сеансовый токен' });
      }
  } catch (error) {
      console.error('Ошибка при проверке сеансового токена:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;