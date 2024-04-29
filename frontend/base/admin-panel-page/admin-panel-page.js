
// Selecting the sidebar and buttons
const sidebar = document.querySelector(".sidebar");
const sidebarOpenBtn = document.querySelector("#sidebar-open");
const sidebarCloseBtn = document.querySelector("#sidebar-close");
const sidebarLockBtn = document.querySelector("#lock-icon");

// Function to toggle the lock state of the sidebar
const toggleLock = () => {
  sidebar.classList.toggle("locked");
  // If the sidebar is not locked
  if (!sidebar.classList.contains("locked")) {
    sidebar.classList.add("hoverable");
    sidebarLockBtn.classList.replace("bx-lock-alt", "bx-lock-open-alt");
  } else {
    sidebar.classList.remove("hoverable");
    sidebarLockBtn.classList.replace("bx-lock-open-alt", "bx-lock-alt");
  }
};

// Function to hide the sidebar when the mouse leaves
const hideSidebar = () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.add("close");
  }
};

// Function to show the sidebar when the mouse enter
const showSidebar = () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.remove("close");
  }
};

// Function to show and hide the sidebar
const toggleSidebar = () => {
  sidebar.classList.toggle("close");
};

// If the window width is less than 800px, close the sidebar and remove hoverability and lock
if (window.innerWidth < 800) {
  sidebar.classList.add("close");
  sidebar.classList.remove("locked");
  sidebar.classList.remove("hoverable");
}

// Adding event listeners to buttons and sidebar for the corresponding actions
sidebarLockBtn.addEventListener("click", toggleLock);
sidebar.addEventListener("mouseleave", hideSidebar);
sidebar.addEventListener("mouseenter", showSidebar);
sidebarCloseBtn.addEventListener("click", toggleSidebar);


document.addEventListener('DOMContentLoaded', async function() {
  // Проверяем наличие сеансового токена в sessionStorage
  const sessionToken = sessionStorage.getItem('sessionToken');
  console.log('sessionToken =>', sessionToken)
  if (sessionToken) {
      // Отправляем запрос на сервер для проверки валидности сеансового токена
      try {
          const response = await fetch('http://127.0.0.1:3000/aunt', {
              headers: {
                  'Authorization': `Bearer ${sessionToken}`
              }
          });

          if (!response.ok) {
              throw new Error('Ошибка при проверке сеансового токена');
          }

          const userData = await response.json();
          console.log('Информация о пользователе:', userData);
          // Теперь у вас есть информация о пользователе userData.username

          // Получаем имя пользователя и сохраняем в переменной
          const userDisplayName = userData.username;
          console.log('Информация о пользователе:', userDisplayName)
          // Отображаем имя пользователя на странице
          const usernameElement = document.querySelector('.data_text #username');
          usernameElement.textContent = userDisplayName;

          // Проверяем роль пользователя
          const userRole = userData.role;
          if (userRole !== 'admin') {
            const adminPanelLink = document.getElementById('admin-panel-link');
            adminPanelLink.style.display = 'none'; // Скрываем кнопку "Admin Panel"
          }
      } catch (error) {
          console.error('Произошла ошибка:', error.message);
      }
  } else {
      console.log('Сеансовый токен отсутствует в sessionStorage');
  }
});


document.addEventListener('DOMContentLoaded', async function() {
  // Проверяем наличие сеансового токена в sessionStorage
  const sessionToken = sessionStorage.getItem('sessionToken');
  if (sessionToken) {
      try {
          const response = await fetch('http://127.0.0.1:3000/profile', {
              headers: {
                  'Authorization': `Bearer ${sessionToken}`
              }
          });

          if (!response.ok) {
              throw new Error('Ошибка при проверке сеансового токена');
          }

          const userData = await response.json();
          const userRole = userData.role;

          // Проверяем роль пользователя
          if (userRole !== 'admin') {
              const adminPanelLink = document.getElementById('admin-panel-link');
              adminPanelLink.style.display = 'none'; // Скрываем кнопку "Admin Panel"
          }

      } catch (error) {
          console.error('Произошла ошибка:', error.message);
      }
  } else {
      console.log('Сеансовый токен отсутствует в sessionStorage');
  }
});



document.addEventListener('DOMContentLoaded', async () => {
  // Получаем элементы DOM
  const categoryInput = document.getElementById('category-input');
  const addCategoryBtn = document.getElementById('add-category-btn');
  const categoryTable = document.getElementById('category-table');

  // Функция для обновления таблицы с категориями
  const updateCategoryTable = async () => {
      try {
          // Очищаем текущие данные в таблице
          categoryTable.innerHTML = '';

          // Запрос к серверу для получения списка категорий
          const response = await fetch('http://127.0.0.1:3000/categories');
          const categories = await response.json();

          // Добавляем каждую категорию в таблицу
          categories.forEach(category => {
              const row = document.createElement('tr');
              row.innerHTML = `<td>${category.category_id}</td><td>${category.category_name}</td><td><button class="delete-category-btn" data-id="${category.category_id}">Delete</button></td>`;
              categoryTable.appendChild(row);
          });

          // Добавляем обработчики событий для кнопок удаления категорий
          const deleteCategoryBtns = document.querySelectorAll('.delete-category-btn');
          deleteCategoryBtns.forEach(btn => {
              btn.addEventListener('click', async () => {
                  const categoryId = btn.dataset.id;
                  await deleteCategory(categoryId);
                  await updateCategoryTable();
              });
          });
      } catch (error) {
          console.error('Ошибка при обновлении таблицы категорий:', error.message);
      }
  };

  // Функция для добавления новой категории
  const addCategory = async () => {
      try {
          const categoryName = categoryInput.value;
          console.log("categoryName", categoryName);
          if (!categoryName) return;

          // Запрос к серверу для добавления категории
          const response = await fetch('http://127.0.0.1:3000/categories/add', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ category_name: categoryName })
          });

          if (!response.ok) {
              throw new Error('Ошибка при добавлении категории');
          }

          // Очищаем поле ввода после успешного добавления
          categoryInput.value = '';

          // Обновляем таблицу категорий
          await updateCategoryTable();
      } catch (error) {
          console.error('Ошибка при добавлении категории:', error.message);
      }
  };

  // Функция для удаления категории
const deleteCategory = async (categoryId) => {
  try {
    console.log("delete category", categoryId)
      // Отправляем запрос DELETE на сервер для удаления категории по ее ID
      const response = await fetch(`http://127.0.0.1:3000/categories/delete/${categoryId}`, {
          method: 'DELETE'
      });

      // Проверяем, был ли успешно удалена категория
      if (response.ok) {
          // Обновляем таблицу категорий
          await updateCategoryTable(); // Предполагаемая функция обновления таблицы категорий
          alert('Категория успешно удалена');
      } else {
          // Если возникла ошибка при удалении категории, выводим сообщение об ошибке
          throw new Error('Ошибка при удалении категории');
      }
  } catch (error) {
      console.error('Ошибка при удалении категории:', error.message);
      alert('Ошибка при удалении категории: ' + error.message);
  }
};


  // Добавляем обработчик события для кнопки добавления категории
  addCategoryBtn.addEventListener('click', addCategory);

  // Обновляем таблицу категорий при загрузке страницы
  await updateCategoryTable();
});


document.addEventListener('DOMContentLoaded', async function() {
  try {
      // Отправляем запрос к серверу для получения списка существующих видео
      const response = await fetch('http://127.0.0.1:3000/videos');
      if (!response.ok) {
          throw new Error('Failed to fetch videos');
      }

      // Получаем данные о существующих видео
      const videoData = await response.json();
      
      // Отображаем данные о существующих видео в таблице
      const videoTableBody = document.querySelector('#video-table tbody');
      videoData.forEach(video => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${video.video_id}</td>
              <td>${video.video_name}</td>
              <td>${video.video_description}</td>
              <td>${video.video_time}</td>
              <td>${video.video_num}</td>
              <td>${video.video_material}</td>
              <td>
                  <button class="delete-video-btn" data-video-id="${video.video_id}">Delete</button>
                  <button class="edit-video-btn" data-video-id="${video.video_id}">Edit</button>
              </td>
          `;
          videoTableBody.appendChild(row);
      });

      // Добавляем обработчики событий для кнопок удаления и редактирования видео
      document.querySelectorAll('.delete-video-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = btn.dataset.videoId; // Получаем идентификатор видео из data-атрибута кнопки
            deleteVideo(videoId);
        });
    });
    

        const openEditPopup = (videoId) => {
            const popup = document.getElementById('edit-video-modal');
            const video = getVideoById(videoId); // Функция, которая получает данные о видео по его идентификатору

                // Заполнение инпутов значениями из объекта video
                document.getElementById('edit-video-name-input').value = video.video_name;
                document.getElementById('edit-video-description-input').value = video.video_description;
                document.getElementById('edit-video-material-input').value = video.video_material;
                document.getElementById('edit-video-num-input').value = video.video_num;
            // Здесь можно добавить логику заполнения формы в попапе данными о видео по его videoId
            popup.style.display = 'block'; // Показываем попап
        };
    
        
        document.querySelectorAll('.edit-video-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const videoId = btn.dataset.videoId; // Получаем идентификатор видео из data-атрибута кнопки
                openEditPopup(videoId); // Открываем попап для редактирования видео
            });
        });

  } catch (error) {
      console.error('Error fetching videos:', error.message);
  }
});

const closeEditPopup = () => {
    const popup = document.getElementById('edit-video-modal');
    popup.style.display = 'none'; // Скрываем попап
};


// Добавление видео в базу данных 
const addVideo = async () => {
  try {
    const videoNameInput = document.getElementById('video-name-input');
    const videoDescriptionInput = document.getElementById('video-description-input');
    const videoMaterialInput = document.getElementById('video-material-input');
    const videoNumInput = document.getElementById('video-num-input');

      const videoName = videoNameInput.value;
      const videoDescription = videoDescriptionInput.value;
      const videoMaterial = videoMaterialInput.value;
      const videoNum = videoNumInput.value;

      // Проверка на заполненность всех полей
      if (!videoName || !videoDescription || !videoMaterial || !videoNum) {
          console.error('Please fill all fields');
          return;
      }

      // Отправка запроса на сервер для добавления нового видео
      const response = await fetch('http://127.0.0.1:3000/videos/add', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ videoName, videoDescription, videoMaterial, videoNum })
      });

      if (!response.ok) {
          throw new Error('Failed to add video');
      }

      // Очищаем поля ввода после успешного добавления
      videoNameInput.value = '';
      videoDescriptionInput.value = '';
      videoMaterialInput.value = '';
      videoNumInput.value = '';

      // Обновляем таблицу видео
      updateVideoTable();
  } catch (error) {
      console.error('Error adding video:', error.message);
  }
};

const updateVideoTable = async () => {
  try {
      const response = await fetch('http://127.0.0.1:3000/videos');
      if (!response.ok) {
          throw new Error('Ошибка при получении видео');
      }
      const videos = await response.json();
      
      // Очищаем таблицу перед обновлением
      const videoTableBody = document.querySelector('#video-table tbody');
      videoTableBody.innerHTML = '';

      // Создаем строки таблицы на основе полученных данных
      videos.forEach(video => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${video.video_id}</td>
              <td>${video.video_name}</td>
              <td>${video.video_description}</td>
              <td>${video.video_time}</td>
              <td>${video.video_num}</td>
              <td>${video.video_material}</td>
              <td>
                  <button class="delete-video-btn" data-id="${video.video_id}">Delete</button>
                  <button class="edit-video-btn" data-id="${video.video_id}">Edit</button>
              </td>
          `;
          videoTableBody.appendChild(row);
      });
  } catch (error) {
      console.error('Ошибка при обновлении таблицы видео:', error.message);
  }
};


// Удаление видео из бд  

const deleteVideo = async (videoId) => {
  try {
      console.log("videoId", videoId);
      const response = await fetch(`http://127.0.0.1:3000/videos/delete/${videoId}`, {
          method: 'DELETE',
      });
      if (!response.ok) {
          throw new Error('Ошибка при удалении видео');
      }
      // После успешного удаления видео, обновляем таблицу
      await updateVideoTable();

      console.log('Видео успешно удалено');
  } catch (error) {
      console.error('Ошибка при удалении видео:', error.message);
  }
};

// Function to handle editing a video
const editVideo = async (videoId) => {
    try {
        // Fetch the video data to pre-fill the edit form
        const response = await fetch(`http://127.0.0.1:3000/videos/${videoId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch video data');
        }
        const videoData = await response.json();

        // Populate the edit form fields with the fetched data
        document.getElementById('edit-video-name-input').value = videoData.video_name;
        document.getElementById('edit-video-description-input').value = videoData.video_description;
        document.getElementById('edit-video-time-input').value = videoData.video_time;
        document.getElementById('edit-video-material-input').value = videoData.video_material;
        document.getElementById('edit-video-num-input').value = videoData.video_num;

        // Display the edit modal
        // Your code to display the modal here
    } catch (error) {
        console.error('Error editing video:', error.message);
    }
};

// Add event listener for Edit buttons





// Получаем ссылку на кнопку "Add Video"
const addVideoBtn = document.getElementById('add-video-btn');

// Добавляем обработчик события клика на кнопку "Add Video"
addVideoBtn.addEventListener('click', addVideo);


