// --- THREE.JS Background Animation ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 5000;
const posArray = new Float32Array(particlesCnt * 3);
for (let i = 0; i < particlesCnt * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({ size: 0.005, color: 0x22d3ee });
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);
camera.position.z = 2;

function animateBg() {
    particlesMesh.rotation.y += 0.0002;
    particlesMesh.rotation.x += 0.0001;
    renderer.render(scene, camera);
    requestAnimationFrame(animateBg);
}
animateBg();

// --- THREE.JS Image Border Animation ---
const borderCanvas = document.getElementById('image-border-canvas');
const borderScene = new THREE.Scene();
const borderCamera = new THREE.PerspectiveCamera(75, borderCanvas.clientWidth / borderCanvas.clientHeight, 0.1, 1000);
const borderRenderer = new THREE.WebGLRenderer({ canvas: borderCanvas, alpha: true });
borderRenderer.setSize(borderCanvas.clientWidth, borderCanvas.clientHeight);

const geometry = new THREE.RingGeometry(1, 1.05, 64);
const material = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.5 });
const ring = new THREE.Mesh(geometry, material);
borderScene.add(ring);
borderCamera.position.z = 1.5;

function animateBorder() {
    ring.rotation.z += 0.001; // Very slow rotation
    borderRenderer.render(borderScene, borderCamera);
    requestAnimationFrame(animateBorder);
}
animateBorder();

// --- Window Resize Handler ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const container = document.querySelector('.profile-image-container');
    borderCamera.aspect = container.clientWidth / container.clientHeight;
    borderCamera.updateProjectionMatrix();
    borderRenderer.setSize(container.clientWidth * 1.25, container.clientHeight * 1.25);
});

// --- Mobile menu toggle ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
const mobileMenuLinks = mobileMenu.getElementsByTagName('a');
for (let link of mobileMenuLinks) {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
}

// --- Set current year in footer ---
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- Custom cursor script ---
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const interactiveElements = document.querySelectorAll("a, button");
let cursorX = 0, cursorY = 0, outlineX = 0, outlineY = 0;
window.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});
const animateCursor = () => {
    outlineX += (cursorX - outlineX) * 0.1;
    outlineY += (cursorY - outlineY) * 0.1;
    cursorDot.style.left = `${cursorX}px`;
    cursorDot.style.top = `${cursorY}px`;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateCursor);
};
interactiveElements.forEach((el) => {
    el.addEventListener("mouseover", () => cursorOutline.classList.add("hover"));
    el.addEventListener("mouseout", () => cursorOutline.classList.remove("hover"));
});
animateCursor();
