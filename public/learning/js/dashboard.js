let allCourses = [];
let enrolledCourseIds = new Set();

async function loadCourses() {
  try {
    renderLoadingState();
    const [courses, enrolledCourses] = await Promise.all([
      api.getCourses(),
      isLoggedIn() ? api.getEnrolledCourses() : [],
    ]);

    allCourses = courses;
    enrolledCourseIds = new Set(enrolledCourses.map((c) => c.courseId));

    filterAndDisplayCourses();
  } catch (error) {
    console.error("Failed to load courses:", error);
  }
}

function filterAndDisplayCourses(searchTerm = "") {
  const courseList = document.getElementById("courseList");
  const filteredCourses = allCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (filteredCourses.length === 0) {
    courseList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search fa-3x"></i>
                <h3>No courses found</h3>
                <p>Try adjusting your search to find what you're looking for.</p>
            </div>
        `;
    return;
  }

  courseList.innerHTML = filteredCourses
    .map(
      (course) => `
        <div class="course-card">
            <div align="center" class="course-thumbnail" >
                <a href="${isLoggedIn() ? "course-details.html" : "preview.html"}?id=${course.id}" class="course-link">
                    <img src="${course.thumbnail}" alt="${course.title}" loading="lazy">
                </a>
            </div>
            <div class="course-info">
                <div>
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-stats">
                        <span><i class="fas fa-user"></i> ${course.students} student(s)</span>
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                        <span><i class="fas fa-star"></i> ${course.rating}</span>
                        <span><i class="fas fa-signal"></i> ${course.level}</span>
                    </div>
                </div>
                ${
                  isLoggedIn()
                    ? enrolledCourseIds.has(course.id)
                      ? `<a href="course-viewer.html?id=${course.id}"  class="continue-button" id="continue-button-${course.id}" aria-label="Continue Learning" title="Continue Learning">
                            Continue Learning 
                           </a>`
                      : `<button class="enroll-button" onclick="enrollCourse(${course.id})" id="enroll-button-${course.id}" aria-label="Enroll Now" title="Enroll Now - $${course.price}">
                            Enroll Now - $${course.price}
                           </button>`
                    : `<div class="preview-actions">
                        <a href="preview.html?id=${course.id}" class="preview-button" id="preview-button-${course.id}" aria-label="Preview Course" title="Preview Course">Preview Course</a>
                        <a href="login.html" class="login-button" aria-label="Sign in to Enroll" title="Sign in to Enroll">Sign in to Enroll</a>
                       </div>`
                }
            </div>
        </div>
    `
    )
    .join("");
}

function renderLoadingState() {
  const courseList = document.getElementById("courseList");
  const loadingCards = Array(6)
    .fill()
    .map(
      () => `
        <div class="course-card">
            <div class="skeleton" style="height: 200px;"></div>
            <div class="course-info">
                <div class="skeleton" style="height: 24px; width: 80%; margin-bottom: 10px;"></div>
                <div class="skeleton" style="height: 16px; width: 60%; margin-bottom: 15px;"></div>
                <div class="skeleton" style="height: 16px; width: 40%; margin-bottom: 20px;"></div>
                <div class="skeleton" style="height: 40px; width: 100%;"></div>
            </div>
        </div>
    `
    )
    .join("");
  courseList.innerHTML = loadingCards;
}

async function renderCourses(courses = allCourses) {
  const courseList = document.getElementById("courseList");

  try {
    const enrolledCourses = isLoggedIn() ? await api.getEnrolledCourses() : [];
    const enrolledCourseIds = new Set(enrolledCourses.map((c) => c.courseId));

    courseList.innerHTML = courses
      .map(
        (course) => `

        <div class="course-card">
            <div align="center" class="course-thumbnail">
                <a href="${isLoggedIn() ? "course-details.html" : "preview.html"}?id=${course.id}" class="course-link">
                    <img src="${course.thumbnail}" alt="${course.title}" loading="lazy">
                </a>
            </div>
            <div class="course-info">
                <div>
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-stats">
                        <span><i class="fas fa-user"></i> ${course.students} student(s)</span>
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                        <span><i class="fas fa-star"></i> ${course.rating}</span>
                        <span><i class="fas fa-signal"></i> ${course.level}</span>
                    </div>
                </div>
                ${
                  isLoggedIn()
                    ? enrolledCourseIds.has(course.id)
                      ? `<a href="course-viewer.html?id=${course.id}" class="continue-button" id="continue-button-${course.id}">
                            Continue Learning
                           </a>`
                      : `<button class="enroll-button" onclick="enrollCourse(${course.id})" id="enroll-button-${course.id}">
                            Enroll Now - $${course.price}
                           </button>`
                    : `<div class="preview-actions">
                        <a href="preview.html?id=${course.id}" class="preview-button" id="preview-button-${course.id}">Preview Course</a>
                        <a href="login.html" class="login-button">Sign in to Enroll</a>
                       </div>`
                }
            </div>
        </div>
    `
      )
      .join("");
  } catch (error) {
    courseList.innerHTML = "<p>Error loading courses. Please try again later.</p>";
    console.error("Failed to load courses:", error);
  }
}

async function enrollCourse(courseId) {
  const button = event.target;
  button.disabled = true;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enrolling...';

  try {
    const result = await api.enrollCourse(courseId);
    if (result.success) {
      button.innerHTML = '<i class="fas fa-check"></i> Enrolled';
      button.style.background = "#10b981";
      setTimeout(() => {
        window.location.href = `/learning/course-viewer.html?id=${courseId}`;
      }, 1000);
    }
  } catch (error) {
    button.innerHTML = "Enroll Now";
    button.disabled = false;
    alert("Failed to enroll. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCourses();

  const searchInput = document.getElementById("courseSearch");
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        filterAndDisplayCourses(e.target.value);
      }, 500);
    });
  }
});
