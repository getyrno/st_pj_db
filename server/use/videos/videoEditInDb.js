const express = require('express');
const router = express.Router();
const { client } = require('../../database');

// Редактирование видео
router.put('/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    const { videoName, videoDescription, videoTime, videoMaterial, videoNum } = req.body;
    
    try {
        // Выполняем запрос к базе данных для обновления данных видео
        const updateVideoQuery = `
            UPDATE videos 
            SET video_name = $1, 
                video_description = $2, 
                video_time = $3, 
                video_material = $4, 
                video_num = $5 
            WHERE video_id = $6`;
        await client.query(updateVideoQuery, [videoName, videoDescription, videoTime, videoMaterial, videoNum, videoId]);

        res.status(200).json({ message: 'Video successfully updated' });
    } catch (error) {
        console.error('Error updating video:', error.message);
        res.status(500).json({ error: 'Failed to update video' });
    }
});

module.exports = router;
