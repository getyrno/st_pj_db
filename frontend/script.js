const forms = document.querySelector(".forms"),
      pwShowHide = document.querySelectorAll(".eye-icon"),
      links = document.querySelectorAll(".link");

pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
        
        pwFields.forEach(password => {
            if(password.type === "password"){
                password.type = "text";
                eyeIcon.classList.replace("bx-hide", "bx-show");
                return;
            }
            password.type = "password";
            eyeIcon.classList.replace("bx-show", "bx-hide");
        })
        
    })
})      

links.forEach(link => {
    link.addEventListener("click", e => {
       e.preventDefault(); //preventing form submit
       forms.classList.toggle("show-signup");
    })
})


document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = new FormData(this);
  const requestData = {
      user_name: formData.get('user_name'),
      user_email: formData.get('user_email'),
      user_password: formData.get('user_password')
  };

  try {
      const response = await fetch('http://127.0.0.1:3000/users', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
      });

      if (!response.ok) {
          throw new Error('Ошибка при отправке запроса на сервер');
      }

      const userData = await response.json();
      console.log('Пользователь успешно зарегистрирован:', userData);
  } catch (error) {
      console.error('Ошибка:', error.message);
      // Отображаем уведомление об ошибке на странице
      const errorMessageElement = document.getElementById('error-message');
      
      // Если есть ответ от сервера
      if (error.response) {
          try {
              // Попытаемся извлечь текст ответа
              const serverError = await error.response.text();
              errorMessageElement.textContent = serverError;
          } catch (e) {
              // Если не удалось извлечь текст ответа, отобразим общее сообщение об ошибке
              errorMessageElement.textContent = 'Произошла ошибка при обработке запроса';
          }
      } else {
          // Если нет ответа от сервера, отобразим общее сообщение об ошибке
          errorMessageElement.textContent = error.message;
      }
      errorMessageElement.style.display = 'block';
  }
});



document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = new FormData(this);
  const requestData = {
      login_name: formData.get('login_name'),
      login_password: formData.get('login_password')
  };

  try {
      const response = await fetch('http://127.0.0.1:3000/auth', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
      });

      if (!response.ok) {
          throw new Error('Ошибка при аутентификации пользователя');
      }

      const userData = await response.json();
      sessionStorage.setItem('sessionToken', userData.sessionToken); // Сохраняем сеансовый токен в sessionStorage
      console.log('Пользователь успешно вошел:', userData);
      window.location.href = '/frontend/base/main.html'; // Перенаправляем пользователя на другую страницу
    } catch (error) {
      console.error('Ошибка:', error.message);
  }
});












