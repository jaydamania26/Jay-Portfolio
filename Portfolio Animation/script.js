import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Init AOS
AOS.init({ duration: 800, easing: 'ease-out-cubic', offset: 50 });

/* =========================================
   1. MOUSE SPOTLIGHT EFFECT (Professional Touch)
   ========================================= */
const cards = document.querySelectorAll('.card');
const cardsGrid = document.querySelector('.cards-grid');

if (cardsGrid) {
    cardsGrid.onmousemove = e => {
        for(const card of cards) {
            const rect = card.getBoundingClientRect(),
                  x = e.clientX - rect.left,
                  y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        };
    }
}

/* =========================================
   2. REFINED 3D GEOMETRY (Cleaner Look)
   ========================================= */
const container = document.getElementById('canvas-container');

if (container && window.innerWidth > 768) {
    const scene = new THREE.Scene();
    
    // Camera Setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2.5;

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.enableDamping = true;

    // --- Create the "Neural Network" Sphere ---
    const geometry = new THREE.IcosahedronGeometry(1.2, 1);
    
    // Wireframe Material (Technological look)
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x3b82f6, // Blue
        wireframe: true, 
        transparent: true, 
        opacity: 0.3 
    });
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(wireframe);

    // Points Material (Data nodes look)
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0x10b981, // Emerald
        size: 0.04,
        transparent: true,
        opacity: 0.8
    });
    const points = new THREE.Points(geometry, pointsMaterial);
    scene.add(points);

    // Inner Core (Logic Center)
    const coreGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x0f172a }); // Dark core to hide back lines
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        
        // Breathing effect
        const time = Date.now() * 0.001;
        const scale = 1 + Math.sin(time) * 0.05;
        wireframe.scale.set(scale, scale, scale);
        points.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

/* =========================================
   3. MOBILE NAVIGATION
   ========================================= */
const mobileBtn = document.querySelector('.mobile-menu-btn');
const dropdown = document.querySelector('.mobile-dropdown');

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        dropdown.classList.toggle('active');
        mobileBtn.innerHTML = dropdown.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}