const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bgCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Stars
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 2000;
const starsPositions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i += 3) {
    starsPositions[i] = (Math.random() - 0.5) * 200;
    starsPositions[i+1] = (Math.random() - 0.5) * 200;
    starsPositions[i+2] = (Math.random() - 0.5) * 200;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// A simple rotating sphere (Mars)
const marsGeometry = new THREE.SphereGeometry(1, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({ color: 0xc1440e });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(5, 0, -10);
scene.add(mars);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0005;
    mars.rotation.y += 0.005;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
