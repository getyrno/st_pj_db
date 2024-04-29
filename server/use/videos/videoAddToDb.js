const express = require('express');
const router = express.Router();
const { client } = require('../../database');

// Добавление нового видео
router.post('/', async (req, res) => {
    try {
        const { videoName, videoDescription, videoMaterial, videoNum } = req.body;
        console.log("videoName",videoName);
        console.log("videoDescription", videoDescription);
        console.log("videoMaterial", videoMaterial);
        console.log("videoNum", videoNum);
        // Вставляем новое видео в таблицу videos
        const insertVideoQuery = 'INSERT INTO videos (video_name, video_time, video_description, video_material, video_num) VALUES ($1, NOW(), $2, $3, $4)';
        await client.query(insertVideoQuery, [videoName, videoDescription, videoMaterial, videoNum]);

        res.status(201).json({ message: 'Video successfully added' });
    } catch (error) {
        console.error('Error adding video:', error);
        res.status(500).json({ error: 'Failed to add video' });
    }
});

module.exports = router;
