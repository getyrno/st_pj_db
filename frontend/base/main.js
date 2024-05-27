// Sidebar functionality
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

document.addEventListener('DOMContentLoaded', async function() {
  const sessionToken = sessionStorage.getItem('sessionToken');
  if (sessionToken) {
    try {
      const response = await fetch('http://127.0.0.1:3000/aunt', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Error verifying session token');
      }

      const userData = await response.json();
      const userDisplayName = userData.username;
      document.querySelector('.data_text #username').textContent = userDisplayName;

      const userIconElement = document.getElementById('userIcon');
      userIconElement.addEventListener('click', goToProfile);
      document.querySelector('.data_text #username').addEventListener('click', goToProfile);
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  } else {
    console.log('Session token is missing in sessionStorage');
  }
});

function goToProfile() {
  window.location.href = 'profile/profile.html';
}

// Search functionality
document.getElementById('searchButton').addEventListener('click', function() {
    window.location.href = `course/course.html`;
});
