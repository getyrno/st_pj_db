

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
          console.log(userData);

          // Проверяем роль пользователя
          if (userRole !== 'admin') {
              const adminPanelLink = document.getElementById('admin-panel-link');
              adminPanelLink.style.display = 'none'; 
          }

      } catch (error) {
          console.error('Произошла ошибка:', error.message);
      }
  } else {
      console.log('Сеансовый токен отсутствует в sessionStorage');
  }
});


document.addEventListener('DOMContentLoaded', async () => {
  const sessionToken = sessionStorage.getItem('sessionToken');
  if (!sessionToken) {
    console.log('Session token is missing in sessionStorage');
    return;
  }

  // Получаем информацию о пользователе и отображаем имя пользователя
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
          console.log(userData);
          console.log(userData);
          const userDisplayName = userData.username;
          const userId = userData.user_id;

    document.querySelector('.data_text #username').textContent = userDisplayName;

    // Получаем историю пользователя
    const historyResponse = await fetch(`http://127.0.0.1:3000/history/${userId}`, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`
      }
    });

    if (!historyResponse.ok) {
      throw new Error('Ошибка при получении истории пользователя');
    }

    const historyData = await historyResponse.json();
    const historyContainer = document.getElementById('history-container');
    historyContainer.innerHTML = '';

    if (historyData.length === 0) {
      historyContainer.innerHTML = '<p>No history available.</p>';
    } else {
      historyData.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
          <h3>${item.video_name}</h3>
          <p>${item.video_description}</p>
          <p><strong>Course:</strong> ${item.course_name}</p>
          <p><strong>Watched on:</strong> ${new Date(item.watch_date).toLocaleString()}</p>
        `;
        historyContainer.appendChild(historyItem);
      });
    }
  } catch (error) {
    console.error('Произошла ошибка:', error.message);
    document.getElementById('history-container').innerHTML = '<p>An error occurred while fetching user history.</p>';
  }
});
