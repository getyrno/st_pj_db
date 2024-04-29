const express = require('express');
const router = express.Router();
const { client } = require('../../database');

// Удаление видео
router.delete('/:videoId', async (req, res) => {
  const videoId = req.params.videoId; // Получаем videoId из параметра маршрута
  console.log('videoId', videoId );
  try {
      // Выполняем запрос к базе данных для удаления видео с указанным идентификатором
      const deleteVideoQuery = 'DELETE FROM videos WHERE video_id = $1';
      await client.query(deleteVideoQuery, [videoId]);

      res.status(200).json({ message: 'Видео успешно удалено' });
  } catch (error) {
      console.error('Ошибка при удалении видео:', error.message);
      res.status(500).json({ error: 'Ошибка сервера при удалении видео' });
  }
});


module.exports = router;
