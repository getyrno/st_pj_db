const express = require('express');
const router = express.Router();
const { client } = require('../../database');

router.post('/', async (req, res) => {
  const { userName, subscriptionName } = req.body; // Предполагается, что идентификатор пользователя и название подписки отправляются в запросе
  console.log("userName", userName);
  console.log("subscriptionName", subscriptionName);
  try {
    // Получаем текущее время
    const currentTime = new Date();
    // Вычисляем время окончания подписки (текущее время + 1 месяц)
    const endTime = new Date(currentTime);
    endTime.setMonth(endTime.getMonth() + 1);

    // Выполняем SQL-запрос для обновления данных о подписке у пользователя
    const query = `
      UPDATE users 
      SET subscription_name = $1,
          subscription_buytime = $2, 
          subscription_endtime = $3
      WHERE user_name = $4
    `;
    await client.query(query, [subscriptionName, currentTime, endTime, userName]);

    res.status(200).json({ message: 'Подписка успешно приобретена и обновлена' });
  } catch (error) {
    console.error('Ошибка при покупке подписки:', error.message);
    res.status(500).json({ error: 'Произошла ошибка при покупке подписки' });
  }
});

module.exports = router;
