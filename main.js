import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// === ESCENA Y CÁMARA ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, -0.6, 3);

// === RENDERER ===
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x4169E1); // Azul inicial
document.getElementById('bg-3d')?.appendChild(renderer.domElement);

// === LUCES ===
scene.add(new THREE.DirectionalLight(0xffffff, 0.8).position.set(0, 0, 5));
scene.add(new THREE.DirectionalLight(0xffffff, 0.8).position.set(-5, 0, -5));
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// === VARIABLES ===
let w3xModel;
let rotateY = true;
let rotateX = false;
let isAnimating = false;

// === CARGAR MODELO ===
const loader = new GLTFLoader();
loader.load('W3X.glb', (gltf) => {
  w3xModel = gltf.scene;
  w3xModel.scale.set(0.5, 0.5, 0.5);
  w3xModel.position.set(0, -1, 0);
  scene.add(w3xModel);
}, undefined, (error) => {
  console.error('Error al cargar W3X.glb:', error);
});

// === ANIMACIÓN GLOBAL ===
function animate() {
  if (w3xModel) {
    if (rotateY) w3xModel.rotation.y += 0.01;
    if (rotateX) w3xModel.rotation.x += 0.005; // Giro lento continuo en X
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

function startLoopRotation(speed = { x: 0.01, y: 0.01, z: 0.01 }) {
  // Activar rotación libre en los tres ejes
  rotateX = false;
  rotateY = false;

  // Inicia una animación infinita (ajustada dentro de animate loop)
  function rotateLoop() {
    if (w3xModel) {
      w3xModel.rotation.x += speed.x;
      w3xModel.rotation.y += speed.y;
      w3xModel.rotation.z += speed.z;
    }
    requestAnimationFrame(rotateLoop);
  }

  rotateLoop();
}


// === FUNCIONES AUXILIARES ===
function iconIsFilled(icon) {
  // Comprueba si el icono tiene la clase 'bi-circle-fill' (activo)
  return icon.classList.contains('bi-circle-fill');
}

function updateIcons(activeLink) {
  document.querySelectorAll('.icon-toggle i').forEach(icon => {
    icon.classList.remove('bi-circle-fill');
    icon.classList.add('bi-circle');
  });
  activeLink.querySelector('i')?.classList.replace('bi-circle', 'bi-circle-fill');
}

// === ESCUCHAR EVENTOS ===
document.addEventListener('DOMContentLoaded', () => {
  const point2 = document.querySelector('.point2 a');
  if (point2) {
    point2.addEventListener('click', async (e) => {  // <-- async para usar await
      e.preventDefault();

      if (isAnimating) return;

      if (iconIsFilled(point2.querySelector('i'))) return;

      isAnimating = true;
      updateIcons(point2);

      await animateModelAndBackground();  // <-- Espera a que termine la animación

      isAnimating = false;
    });
  }

  const point1 = document.querySelector('.point1 a');
  if (point1) {
    point1.addEventListener('click', (e) => {
      e.preventDefault();

      if (isAnimating) return;

      if (iconIsFilled(point1.querySelector('i'))) return;

      isAnimating = true;
      updateIcons(point1);

      if (!w3xModel) return;

      const initialCameraPos = new THREE.Vector3(0, -0.1, 3);
      const initialModelPos = new THREE.Vector3(0, -0.45, 0);
      const initialRotation = new THREE.Euler(0, 0, 0);
      const targetBgColor = new THREE.Color('#4169E1');
      const transitionDuration = 1000;
      const startTime = performance.now();

      rotateX = false;
      rotateY = false;

      const startCameraPos = camera.position.clone();
      const startModelPos = w3xModel.position.clone();
      const startRotation = w3xModel.rotation.clone();
      const startBgColor = renderer.getClearColor(new THREE.Color());

      function animateReset(timestamp) {
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / transitionDuration, 1);

        camera.position.lerpVectors(startCameraPos, initialCameraPos, t);
        camera.lookAt(0, 0, 0);

        w3xModel.position.lerpVectors(startModelPos, initialModelPos, t);
        w3xModel.rotation.x = startRotation.x + (initialRotation.x - startRotation.x) * t;
        w3xModel.rotation.y = startRotation.y + (initialRotation.y - startRotation.y) * t;

        const r = startBgColor.r + (targetBgColor.r - startBgColor.r) * t;
        const g = startBgColor.g + (targetBgColor.g - startBgColor.g) * t;
        const b = startBgColor.b + (targetBgColor.b - startBgColor.b) * t;
        renderer.setClearColor(new THREE.Color(r, g, b));

        if (t < 1) {
          requestAnimationFrame(animateReset);
        } else {
          rotateY = true;
          rotateX = false; // aseguramos que solo gire en Y
          isAnimating = false;
        }
      }

      requestAnimationFrame(animateReset);
    });
  }
      const point3 = document.querySelector('.point3 a');
  if (point3) {
    point3.addEventListener('click', (e) => {
      e.preventDefault();

      if (isAnimating) return;
      if (iconIsFilled(point3.querySelector('i'))) return;

      isAnimating = true;
      updateIcons(point3);

      if (!w3xModel) return;

      // === PARÁMETROS MODIFICABLES ===
      const targetCameraPos = new THREE.Vector3(0, 0, 9); // <-- POSICIÓN FINAL DE CÁMARA
      const transitionDuration = 1000; // <-- DURACIÓN DE ZOOM (ms)
      const rotationSpeed = { x: 0.01, y: 0.01, z: 0.01 }; // <-- VELOCIDAD ROTACIÓN
      const targetBgColor = new THREE.Color('#F0E68C'); // <-- COLOR DE FONDO NUEVO

      rotateX = false;
      rotateY = false;

      // Reiniciar modelo
      w3xModel.rotation.set(0, 0, 0); // <-- Reset de rotación
      w3xModel.position.set(0, 4.8  , 0); // <-- Reset de posición si lo habías cambiado

      const startTime = performance.now();
      const startCameraPos = camera.position.clone();
      const startBgColor = renderer.getClearColor(new THREE.Color());

      function animateZoomAndStartRotation(timestamp) {
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / transitionDuration, 1);

        // Interpolación cámara
        camera.position.lerpVectors(startCameraPos, targetCameraPos, t);
        camera.lookAt(0, 0, 0);

        // Interpolación color de fondo
        const r = startBgColor.r + (targetBgColor.r - startBgColor.r) * t;
        const g = startBgColor.g + (targetBgColor.g - startBgColor.g) * t;
        const b = startBgColor.b + (targetBgColor.b - startBgColor.b) * t;
        renderer.setClearColor(new THREE.Color(r, g, b));

        if (t < 1) {
          requestAnimationFrame(animateZoomAndStartRotation);
        } else {
          // Inicia rotación infinita
          startLoopRotation(rotationSpeed);
          isAnimating = false;
        }
      }

      requestAnimationFrame(animateZoomAndStartRotation);
    });
  }

});

// === ANIMACIÓN DE POINT2 ===
function animateModelAndBackground() {
  return new Promise((resolve) => {  // <-- devuelvo promesa para await
    if (!w3xModel) {
      resolve();
      return;
    }

    const targetColor = new THREE.Color('#DC143C');
    const colorDuration = 2000;
    const rotateFastAngle = Math.PI * 4;
    const rotateFastDuration = 1800;
    const newCameraPosition = new THREE.Vector3(0, -0.2, 3);

    rotateY = false;
    rotateX = false;
    w3xModel.rotation.set(0, 0, 0);
    w3xModel.position.set(0, -0.2, 0);
    camera.position.copy(newCameraPosition);
    camera.lookAt(0, 0, 0);

    const initialColor = renderer.getClearColor(new THREE.Color());

    let colorDone = false;
    let rotationDone = false;

    function checkDone() {
      if (colorDone && rotationDone) {
        rotateX = true;  // Inicia giro lento en X
        resolve();       // <-- termina la promesa cuando las animaciones terminan
      }
    }

    // Animación de color
    let colorStart = null;
    function animateColor(timestamp) {
      if (!colorStart) colorStart = timestamp;
      const elapsed = timestamp - colorStart;
      const t = Math.min(elapsed / colorDuration, 1);

      const r = initialColor.r + (targetColor.r - initialColor.r) * t;
      const g = initialColor.g + (targetColor.g - initialColor.g) * t;
      const b = initialColor.b + (targetColor.b - initialColor.b) * t;
      renderer.setClearColor(new THREE.Color(r, g, b));

      if (t < 1) {
        requestAnimationFrame(animateColor);
      } else {
        colorDone = true;
        checkDone();
      }
    }

    // Animación de giro rápido X, seguido de giro lento X
    const startTime = performance.now();
    const startX = w3xModel.rotation.x;

    function fastRotate(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / rotateFastDuration, 1);
      w3xModel.rotation.x = startX + rotateFastAngle * t;

      if (t < 1) {
        requestAnimationFrame(fastRotate);
      } else {
        rotationDone = true;
        checkDone();
      }
    }

    requestAnimationFrame(animateColor);
    requestAnimationFrame(fastRotate);
  });
}
