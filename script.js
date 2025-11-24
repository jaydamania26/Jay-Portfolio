import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* =========================================
   1. GLOBAL & ANIMATIONS
   ========================================= */
const isMobile = window.matchMedia("(max-width: 768px)").matches;

// Init Animations
AOS.init({ duration: 800, once: false, mirror: false, offset: 100, easing: 'ease-out-cubic' });

/* =========================================
   2. CUSTOM CURSOR (DESKTOP ONLY)
   ========================================= */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverTriggers = document.querySelectorAll('.hover-trigger');

if (cursorDot && cursorOutline && !isMobile) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX; 
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`; 
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
    });

    hoverTriggers.forEach(link => {
        link.addEventListener('mouseenter', () => { document.body.classList.add('hovering'); });
        link.addEventListener('mouseleave', () => { document.body.classList.remove('hovering'); });
    });
}

/* =========================================
   3. CANVAS BACKGROUND (ULTRA QUALITY)
   ========================================= */
const canvas = document.getElementById('canvas-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();

    let particlesArray;
    
    // ULTRA QUALITY SETTING: Same high particle count for mobile and desktop
    const particleDivisor = 9000; 

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y; 
            this.directionX = directionX; this.directionY = directionY; 
            this.size = size; this.color = color;
        }
        draw() { 
            ctx.beginPath(); 
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); 
            ctx.fillStyle = '#64ffda'; 
            ctx.fill(); 
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX; 
            this.y += this.directionY; 
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / particleDivisor;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            particlesArray.push(new Particle(x, y, directionX, directionY, size, '#64ffda'));
        }
    }

    function connect() {
        let opacityValue = 1;
        // ULTRA QUALITY SETTING: Long connection distance even on mobile
        let connectDistance = (canvas.width/7) * (canvas.height/7);

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < connectDistance) {
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = 'rgba(100, 255, 218,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath(); 
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y); 
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y); 
                    ctx.stroke();
                }
            }
        }
    }

    function animateBg() {
        requestAnimationFrame(animateBg);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); }
        connect();
    }

    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
    initParticles(); animateBg();
}

/* =========================================
   4. MOBILE MENU INTERACTION
   ========================================= */
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
if(mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if(navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars'); icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
        }
    });
}
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileBtn.querySelector('i');
        if(icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
    });
});

/* =========================================
   5. 3D CORE (ULTRA QUALITY)
   ========================================= */
const container = document.getElementById('ai-canvas');
if (container) {
    let width = container.clientWidth;
    let height = container.clientHeight;

    function initNeuralCore() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 2.8; 

        // ULTRA QUALITY: Anti-alias enabled on all devices
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
        renderer.setSize(width, height);
        
        // ULTRA QUALITY: Use full device pixel ratio (sharpest possible image)
        renderer.setPixelRatio(window.devicePixelRatio); 
        
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.dampingFactor = 0.05;
        controls.enableZoom = false; 
        controls.enableRotate = true; controls.autoRotate = true; controls.autoRotateSpeed = 2.0;

        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        const coreGeometry = new THREE.IcosahedronGeometry(0.6, 2);
        const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x64ffda, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        mainGroup.add(core);

        const wireframeGeometry = new THREE.IcosahedronGeometry(0.65, 1);
        const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x64ffda, wireframe: true, transparent: true, opacity: 0.3 });
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        mainGroup.add(wireframe);

        const shellGeometry = new THREE.IcosahedronGeometry(1.3, 1);
        const shellMaterial = new THREE.MeshBasicMaterial({ color: 0xbd93f9, wireframe: true, transparent: true, opacity: 0.15 });
        const shell = new THREE.Mesh(shellGeometry, shellMaterial);
        mainGroup.add(shell);

        // ULTRA QUALITY: Full particle count on all devices
        const particleCount = 1000;
        const pGeometry = new THREE.BufferGeometry();
        const pPositions = [];
        for(let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 0.7 + (Math.random() * 0.7); 
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            pPositions.push(x, y, z);
        }
        pGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3));
        const pMaterial = new THREE.PointsMaterial({ color: 0xbd93f9, size: 0.015, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
        const particles = new THREE.Points(pGeometry, pMaterial);
        mainGroup.add(particles);

        const satGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const satMat = new THREE.MeshBasicMaterial({ color: 0x64ffda });
        const satellite = new THREE.Mesh(satGeo, satMat);
        
        const orbitRingGeo = new THREE.TorusGeometry(1.6, 0.005, 16, 100);
        const orbitRingMat = new THREE.MeshBasicMaterial({ color: 0x64ffda, opacity: 0.2, transparent: true });
        const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
        orbitRing.rotation.x = Math.PI / 2;
        
        const satelliteGroup = new THREE.Group();
        satelliteGroup.add(satellite);
        satelliteGroup.add(orbitRing);
        satelliteGroup.rotation.z = Math.PI / 4; 
        satelliteGroup.rotation.x = Math.PI / 6;
        scene.add(satelliteGroup);

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            controls.update(); 
            const time = clock.getElapsedTime();
            
            // Animation logic
            const pulse = 1 + Math.sin(time * 2) * 0.05;
            core.scale.set(pulse, pulse, pulse);
            wireframe.rotation.y = time * 0.1; wireframe.rotation.z = time * 0.05;
            shell.rotation.y = -time * 0.15;
            const orbitSpeed = 1.5; 
            const orbitRadius = 1.6;
            satellite.position.x = Math.cos(time * orbitSpeed) * orbitRadius;
            satellite.position.y = Math.sin(time * orbitSpeed) * orbitRadius;
            mainGroup.position.y = Math.sin(time) * 0.1;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            width = container.clientWidth;
            height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
    }
    initNeuralCore();
}

// Timeline Scroll Observer
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('active'); } 
        else { entry.target.classList.remove('active'); }
    });
}, { threshold: 0.5, rootMargin: "0px 0px -20% 0px" });

const timelineItems = document.querySelectorAll('.active-on-scroll');
timelineItems.forEach(item => { timelineObserver.observe(item); });