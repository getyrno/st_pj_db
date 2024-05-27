const express = require('express');
const router = express.Router();
const { client } = require('../../database'); // Подключение к базе данных

// Получение всех курсов
router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM courses');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await client.query('SELECT * FROM courses WHERE course_id = $1', [id]);
      if (result.rows.length === 0) {
          return res.status(404).json({ msg: 'Course not found' });
      }
      res.json(result.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});
// Добавление нового курса
router.post('/', async (req, res) => {
    const { course_name, description, category_id, release_date, course_pic } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO courses (course_name, description, category_id, release_date, course_pic) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [course_name, description, category_id, release_date, course_pic]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Обновление курса
router.put('/:course_id', async (req, res) => {
    const { course_id } = req.params;
    const { course_name, description, category_id, release_date, course_pic } = req.body;
    try {
        const result = await client.query(
            'UPDATE courses SET course_name = $1, description = $2, category_id = $3, release_date = $4, course_pic = $5 WHERE course_id = $6 RETURNING *',
            [course_name, description, category_id, release_date, course_pic, course_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Удаление курса
router.delete('/:course_id', async (req, res) => {
    const { course_id } = req.params;
    try {
        await client.query('DELETE FROM courses WHERE course_id = $1', [course_id]);
        res.json({ message: 'Course deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/:id/videos', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await client.query(`
          SELECT v.*
          FROM videos v
          JOIN cases c ON c.video_num = v.video_num
          WHERE c.course_id = $1
      `, [id]);
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});


// Добавление нового курса
router.post('/add', async (req, res) => {
  const { courseName, courseDescription, courseCategoryId, courseReleaseDate, coursePic } = req.body;
  try {
      const result = await pool.query(
          'INSERT INTO courses (course_name, description, category_id, release_date, course_pic) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [courseName, courseDescription, courseCategoryId, courseReleaseDate, coursePic]
      );
      res.json(result.rows[0]);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

module.exports = router;
