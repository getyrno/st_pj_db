document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');

  if (courseId) {
    await fetchCourseDetails(courseId);
    await fetchCourseVideos(courseId);
  } else {
    document.getElementById('course-details').innerHTML = '<p>Course ID is missing in the URL.</p>';
  }
});

async function fetchCourseDetails(courseId) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/courses/${courseId}`);
    if (!response.ok) throw new Error('Error fetching course details');

    const course = await response.json();
    const courseDetailsContainer = document.getElementById('course-details');
    const formattedDate = formatDate(course.release_date);
    const coursePicUrl = getCourseImageUrl(course.course_name);

    courseDetailsContainer.innerHTML = `
      <img src="${coursePicUrl}" alt="${course.course_name}" class="course-image">
      <div>
        <h1 class="course-title">${course.course_name}</h1>
        <p class="course-description">${course.description}</p>
        <div class="course-info">
          <p><strong>Release Date:</strong> ${formattedDate}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('An error occurred:', error.message);
    document.getElementById('course-details').innerHTML = '<p>An error occurred while fetching course details.</p>';
  }
}

async function fetchCourseVideos(courseId) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/courses/${courseId}/videos`);
    if (!response.ok) throw new Error('Error fetching course videos');

    const videos = await response.json();
    const courseVideosContainer = document.getElementById('course-videos');
    courseVideosContainer.innerHTML = '<h2>Course Videos</h2>';

    videos.forEach(video => {
      const videoElement = `
        <div class="video-item">
          <h3>${video.video_name}</h3>
          <p>${video.video_description}</p>
          <a href="#" onclick="playVideo('http://127.0.0.1:3000/videos/${video.video_material}', ${video.video_id}, ${courseId}); return false;">Watch Video</a>
        </div>
      `;
      courseVideosContainer.innerHTML += videoElement;
    });

    if (videos.length > 0) {
      playVideo(`http://127.0.0.1:3000/videos/${videos[0].video_material}`, videos[0].video_id, courseId); // Play the first video by default
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    document.getElementById('course-videos').innerHTML = '<p>An error occurred while fetching course videos.</p>';
  }
}

function playVideo(videoUrl, videoId, courseId) {
  const videoSource = document.getElementById('video-source');
  const videoPlayer = document.getElementById('video-player');
  videoSource.src = videoUrl;
  videoPlayer.load();
  logHistory(videoId, courseId);
}

async function logHistory(videoId, courseId) {
  const sessionToken = sessionStorage.getItem('sessionToken');
  if (!sessionToken) {
    console.log('Session token is missing in sessionStorage');
    return;
  }
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
          const userId = userData.user_id;
    const response2 = await fetch('http://127.0.0.1:3000/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ video_id: videoId, course_id: courseId, user_id: userId })
    });

    if (!response2.ok) throw new Error('Error logging history');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function getCourseImageUrl(courseName) {
  const imageDirectory = '../assets/';
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

function goBack() {
  window.history.back();
}
