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
          console.log('Информация о пользователе:', userDisplayName);
          sessionStorage.setItem('userDisplayName', userDisplayName);
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

document.addEventListener('DOMContentLoaded', async () => {
  const subscriptionSelect = document.getElementById('subscription-select');
  const subscriptionName = document.getElementById('subscription-name');
  const subscriptionAccess = document.getElementById('subscription-access');
  const subscriptionPrice = document.getElementById('subscription-price');
  const subscriptionTime = document.getElementById('subscription-time');
  const subscriptionBuyButton = document.getElementById('subscription-buy');

  // Функция для обновления информации о подписке на основе выбранной в списке
  const updateSubscriptionInfo = async (selectedSubscription) => {
    try {
      // Выполняем запрос к серверу для получения информации о выбранной подписке
      const response = await fetch(`http://127.0.0.1:3000/subscription/${selectedSubscription}`);
      const subscriptionData = await response.json();
      
      // Обновляем элементы HTML с информацией о выбранной подписке
      subscriptionName.textContent = subscriptionData.subscription_name;
      subscriptionAccess.textContent = subscriptionData.subscription_access;
      subscriptionPrice.textContent = subscriptionData.subscription_price;
      // Преобразуем объект PostgresInterval в строку с количеством месяцев
      const durationMonths = subscriptionData.subscription_time.months;
      const durationString = durationMonths === 1 ? '1 month' : `${durationMonths} months`;
      subscriptionTime.textContent = durationString;
      subscriptionBuyButton.textContent = subscriptionData.subscription_name;
    } catch (error) {
      console.error(`Ошибка при получении данных о подписке "${selectedSubscription}":`, error.message);
    }
  };
  
  // Функция для выполнения покупки подписки
  const buySubscription = async (selectedSubscription) => {
    try {
      // Получаем идентификатор текущего пользователя из sessionStorage
      const userName = sessionStorage.getItem('userDisplayName');
      console.log('userName', userName)
      // Выполняем запрос к серверу для покупки выбранной подписки
      const response = await fetch(`http://127.0.0.1:3000/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName, subscriptionName: selectedSubscription })
      });
      
      if (response.ok) {
        // Если покупка прошла успешно, обновляем информацию о подписке на странице
        await updateSubscriptionInfo(selectedSubscription);
        alert(`Подписка "${selectedSubscription}" успешно приобретена!`);
      } else {
        // Если возникла ошибка при покупке, выводим сообщение об ошибке
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error('Ошибка при покупке подписки:', error.message);
      alert(`Ошибка при покупке подписки: ${error.message}`);
    }
  };

  // Выполняем обновление информации о подписке при изменении выбора в списке
  subscriptionSelect.addEventListener('change', async (event) => {
    const selectedSubscription = event.target.value;
    await updateSubscriptionInfo(selectedSubscription);
  });

  // Выполняем инициализацию информации о подписке для подписки "Basic" при загрузке страницы
  await updateSubscriptionInfo('Basic');

  // Добавляем обработчик события для кнопки "Купить"
  subscriptionBuyButton.addEventListener('click', async () => {
    const selectedSubscription = subscriptionSelect.value;
    await buySubscription(selectedSubscription);
  });
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
