document.addEventListener('DOMContentLoaded', async () => {
    const sessionToken = sessionStorage.getItem('sessionToken');
    console.log('sessionToken =>', sessionToken);

    if (sessionToken) {
        await fetchUserData(sessionToken);
        await fetchProfileData(sessionToken);
        await checkAdminRole(sessionToken);
    } else {
        console.log('Сеансовый токен отсутствует в sessionStorage');
    }

    setupSidebar();
});

async function fetchUserData(token) {
    try {
        const response = await fetch('http://127.0.0.1:3000/aunt', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Ошибка при проверке сеансового токена');

        const userData = await response.json();
        console.log('Информация о пользователе:', userData);

        const usernameElement = document.querySelector('.data_text #username');
        usernameElement.textContent = userData.username;
    } catch (error) {
        console.error('Произошла ошибка:', error.message);
    }
}

async function fetchProfileData(token) {
    try {
        const response = await fetch('http://127.0.0.1:3000/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Ошибка при проверке сеансового токена');

        const userData = await response.json();
        const userInfoElement = document.getElementById('userInfo');
        let tableHTML = '<table>';

        for (const key in userData) {
            if (shouldDisplayField(key)) {
                let label = getLabel(key);
                let value = userData[key];
                if (isDateField(key)) {
                    value = formatDate(value);
                }
                tableHTML += `<tr><td style="padding-right:10px">${label}</td><td>${value}</td></tr>`;
            }
        }

        tableHTML += '</table>';
        userInfoElement.innerHTML = tableHTML;
    } catch (error) {
        console.error('Произошла ошибка:', error.message);
    }
}

function shouldDisplayField(key) {
    const excludedFields = ['session_id', 'user_id', 'session_token', 'created_at', 'updated_at', 'user_password', 'role'];
    return !excludedFields.includes(key);
}

function getLabel(key) {
    const labels = {
        subscription_name: 'Subscription',
        subscription_buytime: 'Subscription buy time',
        subscription_endtime: 'Subscription end time',
        user_name: 'Username',
        user_email: 'User Email'
    };
    return labels[key] || key;
}

function isDateField(key) {
    return key.endsWith('time');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function setupSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const sidebarLockBtn = document.querySelector("#lock-icon");
    const sidebarCloseBtn = document.querySelector("#sidebar-close");

    const toggleLock = () => {
        sidebar.classList.toggle("locked");
        if (!sidebar.classList.contains("locked")) {
            sidebar.classList.add("hoverable");
            sidebarLockBtn.classList.replace("bx-lock-alt", "bx-lock-open-alt");
        } else {
            sidebar.classList.remove("hoverable");
            sidebarLockBtn.classList.replace("bx-lock-open-alt", "bx-lock-alt");
        }
    };

    const hideSidebar = () => {
        if (sidebar.classList.contains("hoverable")) {
            sidebar.classList.add("close");
        }
    };

    const showSidebar = () => {
        if (sidebar.classList.contains("hoverable")) {
            sidebar.classList.remove("close");
        }
    };

    const toggleSidebar = () => {
        sidebar.classList.toggle("close");
    };

    if (window.innerWidth < 800) {
        sidebar.classList.add("close");
        sidebar.classList.remove("locked");
        sidebar.classList.remove("hoverable");
    }

    sidebarLockBtn.addEventListener("click", toggleLock);
    sidebar.addEventListener("mouseleave", hideSidebar);
    sidebar.addEventListener("mouseenter", showSidebar);
    sidebarCloseBtn.addEventListener("click", toggleSidebar);
}

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
        const response = await fetch('http://127.0.0.1:3000/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при выходе из сессии');
        }

        sessionStorage.removeItem('sessionToken');
        window.location.href = '../../index.html';
    } catch (error) {
        console.error('Произошла ошибка при выходе из сессии:', error.message);
    }
}

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
  