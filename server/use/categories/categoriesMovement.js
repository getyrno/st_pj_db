// categoriesMovement.js

const express = require('express');
const router = express.Router();
const { client } = require('../../database');

// Получение списка категорий
router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM categories');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении списка категорий:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавление новой категории
router.post('/add', async (req, res) => {
  const { category_name } = req.body;
  console.log("category_name", category_name)
  try {
      // Вставляем новую категорию в таблицу categories
      const insertCategoryQuery = 'INSERT INTO categories (category_name) VALUES ($1) RETURNING category_id';
      const categoryResult = await client.query(insertCategoryQuery, [category_name]);
      const categoryId = categoryResult.rows[0].category_id;

      // Если есть данные для создания связи с таблицей courses, то создаем связи
      // Например, передаем массив courseId, который содержит id курсов, которые должны быть связаны с новой категорией
      if (req.body.courseIds && req.body.courseIds.length > 0) {
          const courseIds = req.body.courseIds;
          // Создаем записи в таблице courses, связанные с новой категорией
          const insertCourseQuery = 'INSERT INTO courses (course_name, category_id) VALUES ($1, $2)';
          for (const courseId of courseIds) {
              await client.query(insertCourseQuery, [courseId, categoryId]);
          }
      }

      res.status(201).json({ message: 'Категория успешно создана' });
  } catch (error) {
      console.error('Ошибка при создании категории:', error.message);
      res.status(500).json({ error: 'Ошибка сервера при создании категории' });
  }
});

// Удаление категории
router.delete('/delete/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId;
    try {
        // Сначала удаляем все записи из таблицы courses, которые ссылаются на удаляемую категорию
        await client.query('DELETE FROM courses WHERE category_id = $1', [categoryId]);

        // После этого удаляем саму категорию
        await client.query('DELETE FROM categories WHERE category_id = $1', [categoryId]);

        res.status(200).json({ message: 'Категория успешно удалена' });
    } catch (error) {
        console.error('Ошибка при удалении категории:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при удалении категории' });
    }
});

module.exports = router;
