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
  const sessionToken = sessionStorage.getItem('sessionToken');
  console.log('sessionToken =>', sessionToken);
  
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
          const userInfoElement = document.getElementById('userInfo');
          
          // Создаем таблицу для отображения информации о пользователе
          let tableHTML = '<table>';
          for (const key in userData) {
              let label = '';
              switch (key) {
                  case 'subscription_name':
                      label = 'Subscription';
                      break;
                  case 'subscription_buytime':
                      label = 'Subscription buy time - ';
                      break;
                  case 'subscription_endtime':
                      label = 'Subscription end time - ';
                      break;
                  case 'user_name':
                      label = 'Username';
                      break;
                  case 'user_email':
                      label = 'User Email';
                      break;
                  case 'user_password':
                      label = 'Password';
                      break;
                  default:
                      label = key;
              }
              if (key !== 'user_password') {
                  tableHTML += `<tr><td>${label}</td><td>${userData[key]}</td></tr>`;
              } else {
                  tableHTML += `<tr><td>${label}</td><td><span class="password hidden">******</span><button class="show-password">Показать</button></td></tr>`;
              }
          }
          tableHTML += '</table>';
          
          userInfoElement.innerHTML = tableHTML;
  
          // Добавляем обработчики для кнопок показа пароля
          const showPasswordButtons = document.querySelectorAll('.show-password');
          showPasswordButtons.forEach(button => {
              button.addEventListener('click', () => {
                  const passwordSpan = button.previousElementSibling;
                  if (passwordSpan.classList.contains('hidden')) {
                      passwordSpan.textContent = userData['user_password'];
                      passwordSpan.classList.remove('hidden');
                      button.textContent = 'Скрыть';
                  } else {
                      passwordSpan.textContent = '******';
                      passwordSpan.classList.add('hidden');
                      button.textContent = 'Показать';
                  }
              });
          });
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

function goBack() {
  window.history.back();
}



async function logout() {
  const sessionToken = sessionStorage.getItem('sessionToken');
  if (!sessionToken) {
      console.log('Сеансовый токен отсутствует в sessionStorage');
      return;
  }

  try {
      // Отправляем запрос на сервер для завершения текущей сессии
      const response = await fetch('http://127.0.0.1:3000/logout', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${sessionToken}`
          }
      });

      if (!response.ok) {
          throw new Error('Ошибка при выходе из сессии');
      }

      // Удаляем сеансовый токен из sessionStorage
      sessionStorage.removeItem('sessionToken');

      // Перенаправляем пользователя на страницу входа
      window.location.href = '../../index.html';

  } catch (error) {
      console.error('Произошла ошибка при выходе из сессии:', error.message);
  }
}


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

          // Добавляем обработчик событий для клика на иконку пользователя и никнейм
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