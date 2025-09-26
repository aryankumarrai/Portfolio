// --- Mobile Menu ---
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// --- Dynamic Year for Footer ---
document.getElementById("current-year").textContent = new Date().getFullYear();

// --- Three.js Background Animation ---
let scene, camera, renderer, stars;

function initThreeJS() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("bg-canvas"),
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCnt = 5000;
  const posArray = new Float32Array(particlesCnt * 3);
  for (let i = 0; i < particlesCnt * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
  }
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x22d3ee,
  });

  stars = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(stars);
  camera.position.z = 2;

  window.addEventListener("resize", onWindowResize, false);
  animate();
}

function animate() {
  stars.rotation.y += 0.0002;
  stars.rotation.x += 0.0001;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onWindowResize() {
  // Resize main background canvas
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- Custom Cursor ---
function initCustomCursor() {
  if ("ontouchstart" in window) {
    // It's a touch device, so don't initialize the custom cursor
    return;
  }
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");
  const interactiveElements = document.querySelectorAll("a, button");

  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate(
      {
        left: `${posX}px`,
        top: `${posY}px`,
      },
      { duration: 500, fill: "forwards" }
    );
  });

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseover", () => {
      cursorOutline.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      cursorOutline.classList.remove("hover");
    });
  });

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = "0";
    cursorOutline.style.opacity = "0";
  });

  // Show cursor when re-entering window
  document.addEventListener("mouseenter", () => {
    cursorDot.style.opacity = "1";
    cursorOutline.style.opacity = "1";
  });
}

// --- Smooth Scrolling & Nav Highlighting ---
function initNavigation() {
  const navLinks = document.querySelectorAll("header nav a, #mobile-menu a");
  const sections = document.querySelectorAll("section");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.4,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  navLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      if (mobileMenu.classList.contains("hidden") === false) {
        mobileMenu.classList.add("hidden");
      }
    });
  });

  // Smooth scroll for the main name link
  document
    .querySelector("header a.text-2xl")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#home").scrollIntoView({ behavior: "smooth" });
    });
}

// --- Fetch LeetCode Stats ---
async function fetchLeetCodeStats(username) {
  const totalSolvedEl = document.getElementById("total-solved");
  const easySolvedEl = document.getElementById("easy-solved");
  const mediumSolvedEl = document.getElementById("medium-solved");
  const hardSolvedEl = document.getElementById("hard-solved");

  try {
    const response = await fetch(
      `https://leetcode-stats-api.herokuapp.com/${username}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    if (data.status === "success") {
      totalSolvedEl.textContent = data.totalSolved;
      easySolvedEl.textContent = data.easySolved;
      mediumSolvedEl.textContent = data.mediumSolved;
      hardSolvedEl.textContent = data.hardSolved;
    } else {
      throw new Error(data.message || "Failed to get stats");
    }
  } catch (error) {
    console.error("Failed to fetch LeetCode stats:", error);
    totalSolvedEl.textContent = "N/A";
    easySolvedEl.textContent = "N/A";
    mediumSolvedEl.textContent = "N/A";
    hardSolvedEl.textContent = "N/A";
  }
}

// --- Fetch Codeforces Stats ---
async function fetchCodeforcesStats(username) {
  const cfSolvedEl = document.getElementById("codeforces-solved");
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.status?handle=${username}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (data.status !== "OK") {
      throw new Error("Codeforces API returned an error");
    }

    const submissions = data.result;
    const solvedProblems = new Set();
    submissions.forEach((sub) => {
      if (sub.verdict === "OK") {
        const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
        solvedProblems.add(problemId);
      }
    });

    cfSolvedEl.textContent = solvedProblems.size;
  } catch (error) {
    console.error("Failed to fetch Codeforces stats:", error);
    cfSolvedEl.textContent = "N/A";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initThreeJS();
  initCustomCursor();
  initNavigation();

  fetchLeetCodeStats("aryankumarrai");
  fetchCodeforcesStats("aryankumarrai");
});
