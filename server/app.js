const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRoutes = require('./use/enter/userRoutes');
const authRoutes = require('./use/enter/authRoutes');
const auntRoutes = require('./use/enter/auntRoutes');
const userIdRouter = require('./use/user/userIdRouter');
const userInfoRouter = require('./use/user/userInfo');
const logoutRouter = require('./use/user/logoutRouter');
const subscriprionRouter = require('./use/sub/subscriptionRouter');
const subscriprionPuschaseRouter = require('./use/sub/subscriptionPurchase')
const categoriesRouter = require('./use/categories/categoriesMovement');
const videoFromDataBase = require('./use/videos/videoFromDb.js');
const videoAddToDataBase = require('./use/videos/videoAddToDb.js');
const videoDeleteFromDataBase = require('./use/videos/videoDeleteFromDb.js');
const videoEditInDataBase = require('./use/videos/videoEditInDb.js');
const coursesRouter = require('./use/courses/coursesRouter.js'); // Добавьте путь к маршрутизатору курсов
const historyRoutes = require('./use/history/historyRouter.js');
const casesRouter = require('./use/cases/casesRouter.js'); // Маршрутизатор кейсов



const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true
}));                                                                
app.use('/users', userRoutes); // регистрация
app.use('/auth', authRoutes); // вход
app.use('/aunt', auntRoutes); // проверка токена
app.use('/users/:userId', userIdRouter); // вывод юзернейма по токену
app.use('/profile', userInfoRouter); // вывод данных 
app.use('/logout', logoutRouter); // выход
app.use('/subscription', subscriprionRouter); // запрос подписок
app.use('/purchase', subscriprionPuschaseRouter); // покупка подписки
app.use('/categories', categoriesRouter); // редактирование категорий (запрос удаление добавление)
app.use('/videos', videoFromDataBase); // запрос существующих видео с бд 
app.use('/videos/add', videoAddToDataBase); // запрос га добавление видео в бд 
app.use('/videos/delete', videoDeleteFromDataBase); // запрос на удаление видео из бд 
app.use('/videos/edit', videoEditInDataBase); // запрос на удаление видео из бд 
app.use('/courses', coursesRouter); // запросы курсов
app.use('/history', historyRoutes);
app.use('/cases', casesRouter); // запросы кейсов
app.use('/videos', express.static(path.join(__dirname, 'videos')));

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
