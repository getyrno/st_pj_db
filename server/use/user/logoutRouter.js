// logoutRouter.js

const express = require('express');
const router = express.Router();

// Маршрут для выхода из сессии
router.post('/', (req, res) => {
    // Дополнительные действия, такие как очистка сессии, могут быть добавлены здесь

    // Просто отправляем ответ об успешном выходе
    res.status(200).json({ message: 'Вы успешно вышли из сессии' });
});

module.exports = router;
