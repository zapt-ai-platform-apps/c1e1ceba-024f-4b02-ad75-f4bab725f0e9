import * as THREE from 'three';

function initializeGame(mountElement, setScore, initialScore) {
  const width = mountElement.clientWidth;
  const height = mountElement.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  mountElement.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 10, 10);
  scene.add(directionalLight);

  const catGeometry = new THREE.BoxGeometry(1, 1, 1);
  const catMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 });
  const cat = new THREE.Mesh(catGeometry, catMaterial);
  cat.position.set(0, 0.5, 0);
  scene.add(cat);

  const dogGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const dogMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const dog = new THREE.Mesh(dogGeometry, dogMaterial);
  dog.position.set(5, 0.5, 5);
  scene.add(dog);

  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);

  let animationFrameId;
  const speed = 0.1;
  const keys = {};
  let currentScore = initialScore;

  const handleKeyDown = (e) => {
    keys[e.key.toLowerCase()] = true;
  };

  const handleKeyUp = (e) => {
    keys[e.key.toLowerCase()] = false;
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  let touchStartX = null;
  let touchStartY = null;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null || touchStartY === null) return;
    const deltaX = e.touches[0].clientX - touchStartX;
    const deltaY = e.touches[0].clientY - touchStartY;
    cat.position.x += deltaX * 0.01;
    cat.position.z += deltaY * 0.01;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    touchStartX = null;
    touchStartY = null;
  };

  mountElement.addEventListener('touchstart', handleTouchStart);
  mountElement.addEventListener('touchmove', handleTouchMove);
  mountElement.addEventListener('touchend', handleTouchEnd);

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (keys['w'] || keys['arrowup']) {
      cat.position.z -= speed;
    }
    if (keys['s'] || keys['arrowdown']) {
      cat.position.z += speed;
    }
    if (keys['a'] || keys['arrowleft']) {
      cat.position.x -= speed;
    }
    if (keys['d'] || keys['arrowright']) {
      cat.position.x += speed;
    }

    const dx = cat.position.x - dog.position.x;
    const dz = cat.position.z - dog.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance < 1) {
      currentScore = currentScore + 1;
      setScore(currentScore);
      dog.position.x = (Math.random() - 0.5) * 20;
      dog.position.z = (Math.random() - 0.5) * 20;
    }

    renderer.render(scene, camera);
  }

  animate();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    mountElement.removeEventListener('touchstart', handleTouchStart);
    mountElement.removeEventListener('touchmove', handleTouchMove);
    mountElement.removeEventListener('touchend', handleTouchEnd);
    mountElement.removeChild(renderer.domElement);
  };
}

export { initializeGame };