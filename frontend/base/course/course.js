document.addEventListener('DOMContentLoaded', async () => {
  const sessionToken = sessionStorage.getItem('sessionToken');
  console.log('sessionToken =>', sessionToken);

  if (sessionToken) {
      await fetchCategories();
      await fetchCourses();
  } else {
      console.log('Session token is missing in sessionStorage');
  }

  setupSidebar();
  setupSearch();
});

let categoriesMap = {};

async function fetchCategories() {
  try {
      const response = await fetch('http://127.0.0.1:3000/categories');
      if (!response.ok) throw new Error('Error fetching categories');

      const categories = await response.json();
      const categoriesTable = document.getElementById('categoriesTable');
      categoriesTable.innerHTML = ''; // Clear the table before adding new categories
      categories.forEach(category => {
          categoriesTable.innerHTML += `<tr><td class="category-item" data-category-name="${category.category_name}">${category.category_name}</td></tr>`;
          categoriesMap[category.category_id] = category.category_name; // Store category name by id
      });

      // Add click event listener to each category item
      const categoryItems = document.querySelectorAll('.category-item');
      categoryItems.forEach(item => {
          item.addEventListener('click', function() {
              const categoryName = this.getAttribute('data-category-name');
              const searchInput = document.getElementById('searchInput');
              searchInput.value = categoryName;
              filterCourses(categoryName.toLowerCase());
          });
      });
  } catch (error) {
      console.error('An error occurred:', error.message);
  }
}

async function fetchCourses() {
  try {
      const response = await fetch('http://127.0.0.1:3000/courses');
      if (!response.ok) throw new Error('Error fetching courses');

      const courses = await response.json();
      const coursesContainer = document.getElementById('coursesContainer');
      coursesContainer.innerHTML = '';
      courses.forEach(course => {
          const formattedDate = formatDate(course.release_date);
          const coursePicUrl = getCourseImageUrl(course.course_name); // Get image URL based on course name
          const categoryName = categoriesMap[course.category_id] || 'Unknown Category'; // Get category name by id
          const courseCard = `
              <div class="course-card" data-course-id="${course.course_id}">
                  <img style="width: 280px; height: 200px" class='course-image' src="${coursePicUrl}" alt="Course Image" />
                  <h3>${course.course_name}</h3>
                  <p class='description'>${course.description}</p>
                  <div class='course-info'>
                      <p>Category: ${categoryName}</p>
                      <p>Release Date: ${formattedDate}</p>
                  </div>
              </div>
          `;
          coursesContainer.innerHTML += courseCard;
      });

      // Add click event listener to each course card
      const courseCards = document.querySelectorAll('.course-card');
      courseCards.forEach(card => {
          card.addEventListener('click', function() {
              const courseId = this.getAttribute('data-course-id');
              window.location.href = `course-details/course-details.html?id=${courseId}`;
          });
      });
  } catch (error) {
      console.error('An error occurred:', error.message);
  }
}

function getCourseImageUrl(courseName) {
    const imageDirectory = 'assets/';
    const imageExtension = '.jpg'; // Assuming all images are in JPG format
    let imageName;

    // Map course names to image file names
    switch (courseName.toLowerCase()) {
        case 'html':
            imageName = 'html';
            break;
        case 'css':
            imageName = 'css';
            break;
        case 'javascript':
            imageName = 'javascript';
            break;
        case 'angular':
            imageName = 'angular';
            break;
        case 'react':
            imageName = 'react';
            break;
        default:
            // Default image if course name doesn't match any specific image
            imageName = 'default';
            break;
    }

    return `${imageDirectory}${imageName}${imageExtension}`;
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', function() {
    const filter = searchInput.value.toLowerCase();
    filterCourses(filter);
  });
}

function filterCourses(filter) {
  const courses = document.querySelectorAll('.course-card');
  courses.forEach(course => {
      const courseName = course.querySelector('h3').textContent.toLowerCase();
      const courseDescription = course.querySelector('.description').textContent.toLowerCase();
      const courseCategory = course.querySelector('.course-info p').textContent.toLowerCase();

      if (courseName.includes(filter) || courseDescription.includes(filter) || courseCategory.includes(filter)) {
          course.style.display = '';
      } else {
          course.style.display = 'none';
      }
  });
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
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
      console.log('Session token is missing in sessionStorage');
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
          throw new Error('Error logging out');
      }

      sessionStorage.removeItem('sessionToken');
      window.location.href = '../../index.html';
  } catch (error) {
      console.error('An error occurred while logging out:', error.message);
  }
}



