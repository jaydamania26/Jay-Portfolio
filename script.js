import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* =========================================
   1. GLOBAL & ANIMATIONS
   ========================================= */
// Init Animations
AOS.init({ duration: 800, once: false, mirror: false, offset: 100, easing: 'ease-out-cubic' });

/* =========================================
   2. CANVAS BACKGROUND (PRO CODER EDITION)
   ========================================= */
const canvas = document.getElementById('canvas-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();

    let particlesArray;
    
    // SYNTAX HIGHLIGHTING PALETTE (VSCode / Dracula Theme)
    const codeColors = [
        '#58a6ff', // Function Blue
        '#79c0ff', // Variable Light Blue
        '#d2a8ff', // Keyword Purple
        '#ff7b72', // Error Red
        '#7ee787'  // String Green
    ];

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y; 
            this.directionX = directionX; this.directionY = directionY; 
            this.size = size; 
            this.color = color;
        }
        draw() { 
            ctx.beginPath(); 
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); 
            ctx.fillStyle = this.color; 
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
        // Slight reduction for a cleaner "clean code" look
        let numberOfParticles = (canvas.height * canvas.width) / 10000; 
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.5; // Smaller, sharp dots
            let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            // Randomly select a code syntax color
            let randomColor = codeColors[Math.floor(Math.random() * codeColors.length)];
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, randomColor));
        }
    }

    function connect() {
        let opacityValue = 1;
        let connectDistance = (canvas.width/7) * (canvas.height/7);

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < connectDistance) {
                    opacityValue = 1 - (distance/20000);
                    // Lines are subtle gray (like code indents/guides)
                    ctx.strokeStyle = 'rgba(139, 148, 158,' + (opacityValue * 0.5) + ')'; 
                    ctx.lineWidth = 0.5;
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
   3. MOBILE MENU INTERACTION
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
   4. 3D CORE (ULTRA QUALITY)
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

/* =========================================
   5. DOWNLOAD MODAL LOGIC (ADDED)
   ========================================= */
const modal = document.getElementById('download-modal');
const confirmBtn = document.getElementById('btn-confirm');
const cancelBtn = document.getElementById('btn-cancel');
let targetLink = null;

if(modal) {
    document.querySelectorAll('a[href$=".pdf"], a[href$=".pptx"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            targetLink = link.getAttribute('href'); 
            modal.classList.add('active'); 
        });
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        targetLink = null;
    });

    confirmBtn.addEventListener('click', () => {
        if(targetLink) {
            window.open(targetLink, '_blank');
            modal.classList.remove('active');
        }
    });

    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.classList.remove('active');
    });
}