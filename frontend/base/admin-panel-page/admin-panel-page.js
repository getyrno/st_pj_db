document.addEventListener('DOMContentLoaded', async () => {
    const sessionToken = sessionStorage.getItem('sessionToken');
    console.log('sessionToken =>', sessionToken);

    setupSidebar();
    setupUserInfo();
    setupCategoryManagement();
    setupVideoManagement();
    setupCourseManagement();
    setupCaseManagement();
});

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

async function setupUserInfo() {
    const sessionToken = sessionStorage.getItem('sessionToken');
    if (sessionToken) {
        try {
            const response = await fetch('http://127.0.0.1:3000/aunt', {
                headers: { 'Authorization': `Bearer ${sessionToken}` }
            });
            if (!response.ok) throw new Error('Ошибка при проверке сеансового токена');

            const userData = await response.json();
            document.querySelector('.data_text #username').textContent = userData.username;

            if (userData.role !== 'admin') {
                document.getElementById('admin-panel-link').style.display = 'none';
            }
        } catch (error) {
            console.error('Произошла ошибка:', error.message);
        }
    } else {
        console.log('Сеансовый токен отсутствует в sessionStorage');
    }
}

function setupCategoryManagement() {
    const categoryInput = document.getElementById('category-input');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const categoryTable = document.getElementById('category-table');

    const updateCategoryTable = async () => {
        try {
            categoryTable.innerHTML = '';
            const response = await fetch('http://127.0.0.1:3000/categories');
            const categories = await response.json();

            categories.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${category.category_id}</td><td>${category.category_name}</td><td><button class="delete-category-btn" data-id="${category.category_id}">Delete</button></td>`;
                categoryTable.appendChild(row);
            });

            document.querySelectorAll('.delete-category-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    await deleteCategory(btn.dataset.id);
                });
            });
        } catch (error) {
            console.error('Ошибка при обновлении таблицы категорий:', error.message);
        }
    };

    const addCategory = async () => {
        const categoryName = categoryInput.value;
        if (!categoryName) return;

        try {
            const response = await fetch('http://127.0.0.1:3000/categories/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_name: categoryName })
            });
            if (!response.ok) throw new Error('Ошибка при добавлении категории');

            categoryInput.value = '';
            await updateCategoryTable();
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error.message);
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/categories/delete/${categoryId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Ошибка при удалении категории');
            await updateCategoryTable();
        } catch (error) {
            console.error('Ошибка при удалении категории:', error.message);
        }
    };

    addCategoryBtn.addEventListener('click', addCategory);
    updateCategoryTable();
}

function setupVideoManagement() {
    const addVideoBtn = document.getElementById('add-video-btn');
    const videoTableBody = document.querySelector('#video-table tbody');
    const editModal = document.getElementById('edit-video-modal');
    const closeEditPopupBtn = document.querySelector('.close-video-edit');

    const updateVideoTable = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3000/videos');
            if (!response.ok) throw new Error('Ошибка при получении видео');
            const videos = await response.json();

            videoTableBody.innerHTML = '';
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
                    </td>`;
                videoTableBody.appendChild(row);
            });

            document.querySelectorAll('.delete-video-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteVideo(btn.dataset.id));
            });

            document.querySelectorAll('.edit-video-btn').forEach(btn => {
                btn.addEventListener('click', () => openEditPopup(btn.dataset.id));
            });
        } catch (error) {
            console.error('Ошибка при обновлении таблицы видео:', error.message);
        }
    };

    const addVideo = async () => {
        const videoName = document.getElementById('video-name-input').value;
        const videoDescription = document.getElementById('video-description-input').value;
        const videoMaterial = document.getElementById('video-material-input').value;
        const videoNum = document.getElementById('video-num-input').value;

        if (!videoName || !videoDescription || !videoMaterial || !videoNum) return;

        try {
            const response = await fetch('http://127.0.0.1:3000/videos/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoName, videoDescription, videoMaterial, videoNum })
            });
            if (!response.ok) throw new Error('Failed to add video');

            document.getElementById('video-name-input').value = '';
            document.getElementById('video-description-input').value = '';
            document.getElementById('video-material-input').value = '';
            document.getElementById('video-num-input').value = '';

            await updateVideoTable();
        } catch (error) {
            console.error('Error adding video:', error.message);
        }
    };

    const deleteVideo = async (videoId) => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/videos/delete/${videoId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Ошибка при удалении видео');
            await updateVideoTable();
        } catch (error) {
            console.error('Ошибка при удалении видео:', error.message);
        }
    };

    const openEditPopup = async (videoId) => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/videos/${videoId}`);
            if (!response.ok) throw new Error('Failed to fetch video data');
            const videoData = await response.json();

            document.getElementById('edit-video-name-input').value = videoData.video_name;
            document.getElementById('edit-video-description-input').value = videoData.video_description;
            document.getElementById('edit-video-time-input').value = videoData.video_time;
            document.getElementById('edit-video-material-input').value = videoData.video_material;
            document.getElementById('edit-video-num-input').value = videoData.video_num;

            editModal.style.display = 'block';
        } catch (error) {
            console.error('Error editing video:', error.message);
        }
    };

    addVideoBtn.addEventListener('click', addVideo);
    closeEditPopupBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });
    updateVideoTable();
}

function setupCourseManagement() {
    const addCourseBtn = document.getElementById('add-course-btn');
    const courseTableBody = document.querySelector('#course-table tbody');

    const updateCourseTable = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3000/courses');
            if (!response.ok) throw new Error('Ошибка при получении курсов');
            const courses = await response.json();

            courseTableBody.innerHTML = '';
            courses.forEach(course => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${course.course_id}</td>
                    <td>${course.course_name}</td>
                    <td>${course.description}</td>
                    <td>${course.category_id}</td>
                    <td>${course.release_date}</td>
                    <td><img src="${course.course_pic}" alt="${course.course_name}"></td>
                    <td>
                        <button class="delete-course-btn" data-id="${course.course_id}">Delete</button>
                        <button class="edit-course-btn" data-id="${course.course_id}">Edit</button>
                    </td>`;
                courseTableBody.appendChild(row);
            });

            document.querySelectorAll('.delete-course-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteCourse(btn.dataset.id));
            });

            document.querySelectorAll('.edit-course-btn').forEach(btn => {
                btn.addEventListener('click', () => openEditCoursePopup(btn.dataset.id));
            });
        } catch (error) {
            console.error('Ошибка при обновлении таблицы курсов:', error.message);
        }
    };

    const addCourse = async () => {
        const courseName = document.getElementById('course-name-input').value;
        const courseDescription = document.getElementById('course-description-input').value;
        const courseCategoryId = document.getElementById('course-category-id-input').value;
        const courseReleaseDate = document.getElementById('course-release-date-input').value;
        const coursePic = document.getElementById('course-pic-input').value;

        if (!courseName || !courseDescription || !courseCategoryId || !courseReleaseDate || !coursePic) return;

        try {
            const response = await fetch('http://127.0.0.1:3000/courses/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseName, courseDescription, courseCategoryId, courseReleaseDate, coursePic })
            });
            if (!response.ok) throw new Error('Failed to add course');

            document.getElementById('course-name-input').value = '';
            document.getElementById('course-description-input').value = '';
            document.getElementById('course-category-id-input').value = '';
            document.getElementById('course-release-date-input').value = '';
            document.getElementById('course-pic-input').value = '';

            await updateCourseTable();
        } catch (error) {
            console.error('Error adding course:', error.message);
        }
    };

    const deleteCourse = async (courseId) => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/courses/delete/${courseId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Ошибка при удалении курса');
            await updateCourseTable();
        } catch (error) {
            console.error('Ошибка при удалении курса:', error.message);
        }
    };

    const openEditCoursePopup = async (courseId) => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/courses/${courseId}`);
            if (!response.ok) throw new Error('Failed to fetch course data');
            const courseData = await response.json();

            document.getElementById('edit-course-name-input').value = courseData.course_name;
            document.getElementById('edit-course-description-input').value = courseData.description;
            document.getElementById('edit-course-category-id-input').value = courseData.category_id;
            document.getElementById('edit-course-release-date-input').value = courseData.release_date;
            document.getElementById('edit-course-pic-input').value = courseData.course_pic;

            document.getElementById('edit-course-modal').style.display = 'block';
        } catch (error) {
            console.error('Error editing course:', error.message);
        }
    };

    addCourseBtn.addEventListener('click', addCourse);
    updateCourseTable();
}

function setupCaseManagement() {
    const addCaseBtn = document.getElementById('add-case-btn');
    const caseTableBody = document.querySelector('#case-table tbody');

    const updateCaseTable = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3000/cases');
            if (!response.ok) throw new Error('Ошибка при получении кейсов');
            const cases = await response.json();

            caseTableBody.innerHTML = '';
            cases.forEach(caseItem => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${caseItem.case_id}</td>
                    <td>${caseItem.video_num}</td>
                    <td>${caseItem.course_id}</td>
                    <td>
                        <button class="delete-case-btn" data-id="${caseItem.case_id}">Delete</button>
                    </td>`;
                caseTableBody.appendChild(row);
            });

            document.querySelectorAll('.delete-case-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteCase(btn.dataset.id));
            });
        } catch (error) {
            console.error('Ошибка при обновлении таблицы кейсов:', error.message);
        }
    };

    const addCase = async () => {
        const videoNum = document.getElementById('case-video-num-input').value;
        const courseId = document.getElementById('case-course-id-input').value;

        if (!videoNum || !courseId) return;

        try {
            const response = await fetch('http://127.0.0.1:3000/cases/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoNum, courseId })
            });
            if (!response.ok) throw new Error('Failed to add case');

            document.getElementById('case-video-num-input').value = '';
            document.getElementById('case-course-id-input').value = '';

            await updateCaseTable();
        } catch (error) {
            console.error('Error adding case:', error.message);
        }
    };

    const deleteCase = async (caseId) => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/cases/delete/${caseId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Ошибка при удалении кейса');
            await updateCaseTable();
        } catch (error) {
            console.error('Ошибка при удалении кейса:', error.message);
        }
    };

    addCaseBtn.addEventListener('click', addCase);
    updateCaseTable();
}
