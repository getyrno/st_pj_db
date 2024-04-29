// subscriptionRouter.js

const express = require('express');
const router = express.Router();
const { client } = require('../../database');

router.get('/:name', async (req, res) => { // Обработка параметра маршрута ":name"
  const { name } = req.params;
  console.log('Название подписки:', name); 
  // Здесь выполните запрос к базе данных, чтобы получить информацию о подписке по имени
  // Пример запроса к базе данных
  try {
      const subscription = await client.query('SELECT * FROM subscriptions WHERE subscription_name = $1', [name]);
      console.log('Подписка:', subscription.rows[0]); 

      res.json(subscription.rows[0]); // Отправляем информацию о подписке в формате JSON
  } catch (error) {
      console.error('Ошибка при выполнении запроса:', error.message);
      res.status(500).json({ error: 'Произошла ошибка при получении информации о подписке' });
  }
});

module.exports = router;
