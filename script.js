/* =========================================
   1. MAIN INITIALIZATION
   ========================================= */
window.addEventListener('load', () => {

    // Initialize Animation On Scroll Library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: false,
            mirror: false,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    // Initialize Components
    initScrollProgress();
    initParticles();
    initTypewriter();
    initTiltEffect();
    initThreeJS();
    initNavigation();
    initCustomCursor();

    // 🌟 NEW FEATURES 🌟
    initDownloadModal(); // Recruiter Detector
    initDirectContactForm(); // Direct Discord Message
    initHackerMode(); // Konami Code

    // Notify Discord (Custom Layout)
    notifyVisit();

    // Initialize Projects Horizontal Scroll Dots
    initProjectDots();
});

function initMorphingShowcase() {
    // STOP ON MOBILE: Save battery and prevent congestion
    if (window.innerWidth < 769) return;

    const canvasContainer = document.getElementById('morphing-canvas');
    const track = document.getElementById('project-track');
    const cards = document.querySelectorAll('.glass-card');
    if (!canvasContainer || !track) return;

    canvasContainer.innerHTML = '';
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);

    const particleCount = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.025,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    camera.position.z = 5;

    // --- MOUSE TRACKING SYSTEM ---
    const mouse = new THREE.Vector2(-999, -999); // Start off-screen
    const raycaster = new THREE.Raycaster();
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Flat plane at z=0
    const mouse3D = new THREE.Vector3();

    window.addEventListener('mousemove', (event) => {
        // Normalize mouse coordinates (-1 to +1)
        const rect = canvasContainer.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Convert 2D mouse to 3D space
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(mousePlane, mouse3D);
    });

    // --- COLOR LOGIC ---
    const themeColor = new THREE.Color(0x64ffda);
    const outerColor = new THREE.Color(0xffffff);

    function updateColors(targetPositions) {
        const colorAttr = points.geometry.attributes.color;
        for (let i = 0; i < particleCount; i++) {
            const x = targetPositions[i * 3];
            const y = targetPositions[i * 3 + 1];
            const z = targetPositions[i * 3 + 2];
            const dist = Math.sqrt(x * x + y * y + z * z);
            const lerpFactor = Math.min(dist / 2.2, 1);
            const mixedColor = new THREE.Color().copy(themeColor).lerp(outerColor, lerpFactor);
            colorAttr.array[i * 3] = mixedColor.r;
            colorAttr.array[i * 3 + 1] = mixedColor.g;
            colorAttr.array[i * 3 + 2] = mixedColor.b;
        }
        colorAttr.needsUpdate = true;
    }

    // --- 6 VOLUMETRIC SHAPES ---
    const getOrb = () => {
        const pts = [];
        for (let i = 0; i < particleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;
            const r = i % 8 === 0 ? 0.6 : 1.9 + (Math.random() - 0.5) * 0.2;
            pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        }
        return pts;
    };

    const getLattice = () => {
        const pts = [];
        for (let i = 0; i < particleCount; i++) {
            const x = (Math.floor(Math.random() * 5) - 2) * 0.8;
            const y = (Math.floor(Math.random() * 5) - 2) * 0.8;
            const z = (Math.floor(Math.random() * 5) - 2) * 0.8;
            pts.push(x + (Math.random() - 0.5) * 0.5, y + (Math.random() - 0.5) * 0.5, z + (Math.random() - 0.5) * 0.5);
        }
        return pts;
    };

    const getWeb = () => {
        const pts = [];
        for (let i = 0; i < particleCount; i++) {
            const t = (i / particleCount) * Math.PI * 2;
            const x = Math.sin(t) + 2 * Math.sin(2 * t);
            const y = Math.cos(t) - 2 * Math.cos(2 * t);
            const z = -Math.sin(3 * t);
            pts.push(x * 0.7 + (Math.random() - 0.5) * 0.4, y * 0.7 + (Math.random() - 0.5) * 0.4, z * 0.7 + (Math.random() - 0.5) * 0.4);
        }
        return pts;
    };

    const getPrism = () => {
        const pts = [];
        for (let i = 0; i < particleCount; i++) {
            const h = (Math.random() - 0.5) * 4;
            const r = (2 - Math.abs(h)) * 0.8;
            const angle = Math.random() * Math.PI * 2;
            pts.push(Math.cos(angle) * r, h, Math.sin(angle) * r);
        }
        return pts;
    };

    const getVault = () => {
        const pts = [];
        for (let i = 0; i < particleCount; i++) {
            let x = (Math.random() - 0.5) * 3;
            let y = (Math.random() - 0.5) * 3;
            let z = (Math.random() - 0.5) * 3;
            if (Math.abs(x) > 1.2 || Math.abs(y) > 1.2 || Math.abs(z) > 1.2) pts.push(x, y, z);
            else pts.push((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2);
        }
        return pts;
    };

    const getLogisticsDome = () => {
        const pts = [];
        for (let i = 0; i < particleCount; i++) {
            const phi = Math.acos(-1 + (2 * Math.random()));
            const theta = Math.random() * Math.PI * 2;
            const r = i % 3 === 0 ? 0.5 + Math.random() * 0.3 : 1.8 + (Math.random() - 0.5) * 0.2;
            pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        }
        return pts;
    };

    const shapes = {
        orb: getOrb(), lattice: getLattice(), web: getWeb(),
        prism: getPrism(), vault: getVault(), ship: getLogisticsDome()
    };

    let currentTarget = shapes.orb;
    updateColors(currentTarget);

    function animate() {
        requestAnimationFrame(animate);
        const pos = points.geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // 1. Target Position (The shape logic)
            const targetX = currentTarget[i3];
            const targetY = currentTarget[i3 + 1];
            const targetZ = currentTarget[i3 + 2];

            // 2. Attraction to Target (Smooth Morphing)
            pos[i3] += (targetX - pos[i3]) * 0.08;
            pos[i3 + 1] += (targetY - pos[i3 + 1]) * 0.08;
            pos[i3 + 2] += (targetZ - pos[i3 + 2]) * 0.08;

            // 3. MOUSE REPULSION LOGIC
            const dx = pos[i3] - mouse3D.x;
            const dy = pos[i3 + 1] - mouse3D.y;
            const dz = pos[i3 + 2] - mouse3D.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            const repulsionRadius = 1.2; // How close mouse needs to be
            const repulsionStrength = 0.5; // How hard it pushes

            if (distance < repulsionRadius) {
                const force = (repulsionRadius - distance) / repulsionRadius;
                pos[i3] += dx * force * repulsionStrength;
                pos[i3 + 1] += dy * force * repulsionStrength;
                pos[i3 + 2] += dz * force * repulsionStrength;
            }
        }

        points.geometry.attributes.position.needsUpdate = true;
        points.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();

    track.addEventListener('scroll', () => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const center = window.innerWidth / 2;
            if (rect.left < center && rect.right > center) {
                card.classList.add('active');
                const shapeName = card.dataset.shape;
                if (shapes[shapeName]) {
                    currentTarget = shapes[shapeName];
                    updateColors(currentTarget);
                }
            } else {
                card.classList.remove('active');
            }
        });
    });

    window.addEventListener('resize', () => {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    });
}
initMorphingShowcase();


function initProVisualSystem() {
    // STOP ON MOBILE
    if (window.innerWidth < 769) return;

    const container = document.getElementById('morphing-canvas-container');
    const track = document.getElementById('pro-scroll-track');
    const cards = document.querySelectorAll('.pro-glass-card');
    if (!container || !track) return;

    // --- SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(650, 650);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const particleCount = 12000; // High Density
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.022,
        vertexColors: true, // Enables the White-to-Green gradient
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    // --- ADD THIS LINE HERE ---
    camera.position.y = -1.5; // Adjust this number: -0.5 is a little, -1.5 is a lot.
    camera.position.z = 5;

    // --- COLOR THEME ---
    const neonGreen = new THREE.Color(0x64ffda);
    const brightWhite = new THREE.Color(0xffffff);

    // --- PROFESSIONAL ARCHITECTURAL SHAPES ---
    const getTarget = (type) => {
        const pts = [];
        for (let i = 0; i < particleCount; i++) {
            if (type === 'orb') { // Project 1: Neural Orb
                const phi = Math.acos(-1 + (2 * i) / particleCount);
                const theta = Math.sqrt(particleCount * Math.PI) * phi;
                const r = i % 10 === 0 ? 0.4 : 2.0 + (Math.random() - 0.5) * 0.2;
                pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
            } else if (type === 'lattice') { // Project 2: Data Grid
                pts.push((Math.floor(Math.random() * 6) - 2.5) * 0.7, (Math.floor(Math.random() * 6) - 2.5) * 0.7, (Math.floor(Math.random() * 6) - 2.5) * 0.7);
            } else if (type === 'web') { // Project 3: Logic Knot
                const t = (i / particleCount) * Math.PI * 2;
                const x = (Math.sin(t) + 2 * Math.sin(2 * t)) * 0.6;
                const y = (Math.cos(t) - 2 * Math.cos(2 * t)) * 0.6;
                const z = -Math.sin(3 * t) * 0.6;
                pts.push(x + (Math.random() - 0.5) * 0.4, y + (Math.random() - 0.5) * 0.4, z + (Math.random() - 0.5) * 0.4);
            } else if (type === 'prism') { // Project 4: Structure
                const h = (Math.random() - 0.5) * 4; const r = (2 - Math.abs(h)) * 0.6; const a = Math.random() * Math.PI * 2;
                pts.push(Math.cos(a) * r, h, Math.sin(a) * r);
            } else if (type === 'vault') { // Project 5: Storage
                let x = (Math.random() - 0.5) * 3.2; let y = (Math.random() - 0.5) * 3.2; let z = (Math.random() - 0.5) * 3.2;
                if (Math.abs(x) > 1.3 || Math.abs(y) > 1.3 || Math.abs(z) > 1.3) pts.push(x, y, z); else pts.push(0, 0, 0);
            } else { // Project 6: Logistics Dome
                const phi = Math.acos(-1 + (2 * Math.random())); const theta = Math.random() * Math.PI * 2;
                const r = i % 4 === 0 ? 0.4 : 1.9;
                pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
            }
        }
        return pts;
    };

    let currentTarget = getTarget('orb');

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);

        const posAttr = points.geometry.attributes.position;
        const colAttr = points.geometry.attributes.color;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // 1. Move position
            posAttr.array[i3] += (currentTarget[i3] - posAttr.array[i3]) * 0.08;
            posAttr.array[i3 + 1] += (currentTarget[i3 + 1] - posAttr.array[i3 + 1]) * 0.08;
            posAttr.array[i3 + 2] += (currentTarget[i3 + 2] - posAttr.array[i3 + 2]) * 0.08;

            // 2. Dynamic Gradient: Green core, White shell
            const dist = Math.sqrt(posAttr.array[i3] ** 2 + posAttr.array[i3 + 1] ** 2 + posAttr.array[i3 + 2] ** 2);
            const mixedColor = new THREE.Color().copy(neonGreen).lerp(brightWhite, dist / 2.5);
            colAttr.array[i3] = mixedColor.r;
            colAttr.array[i3 + 1] = mixedColor.g;
            colAttr.array[i3 + 2] = mixedColor.b;
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
        points.rotation.y += 0.004; // Smooth spin

        renderer.render(scene, camera);
    }
    animate();

    // --- INTERACTION ---
    track.addEventListener('scroll', () => {
        cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const center = window.innerWidth / 2;
            if (rect.left < center && rect.right > center) {
                card.classList.add('active');
                currentTarget = getTarget(card.dataset.shape);
            } else {
                card.classList.remove('active');
            }
        });
    });
}
// Note: This function was defined but not called in previous context if replaced by showcase. 
// Keeping it safe as fallback logic for 'pro' system if enabled.
initProVisualSystem();

/* =========================================
   DOT NAVIGATION FOR PROJECTS SECTION
   ========================================= */

function initProjectDots() {
    const track = document.getElementById('project-track');
    const cards = document.querySelectorAll('.glass-card');

    if (!track || cards.length === 0) return;

    // Create dot container
    const dotContainer = document.createElement('div');
    dotContainer.className = 'project-dots';

    // Create dots for each project
    cards.forEach((card, index) => {
        const dot = document.createElement('div');
        dot.className = 'project-dot';
        dot.dataset.index = index;

        // Click handler - scroll to specific card
        dot.addEventListener('click', () => {
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        });

        dotContainer.appendChild(dot);
    });

    // Add dots to page (append to projects section)
    const projectSection = document.getElementById('projects');
    if (projectSection) {
        // Ensure we don't duplicate dots if function runs twice
        const existingDots = projectSection.querySelector('.project-dots');
        if (existingDots) existingDots.remove();

        projectSection.appendChild(dotContainer);
    }

    // Update active dot on scroll
    const updateActiveDot = () => {
        const dots = document.querySelectorAll('.project-dot');
        const centerX = window.innerWidth / 2;

        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();

            // Check if card is centered
            if (rect.left < centerX && rect.right > centerX) {
                // Remove active from all dots
                dots.forEach(d => d.classList.remove('active'));
                // Add active to current dot
                if (dots[index]) dots[index].classList.add('active');
            }
        });
    };

    // Listen to scroll
    track.addEventListener('scroll', updateActiveDot);

    // Set first dot as active initially
    const firstDot = dotContainer.querySelector('.project-dot');
    if (firstDot) firstDot.classList.add('active');
}


/* =========================================
   2. COMPONENT FUNCTIONS
   ========================================= */

// --- Scroll Progress Bar ---
function initScrollProgress() {
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        const bar = document.querySelector('.scroll-progress');
        if (bar) bar.style.width = scrolled + "%";
    });
}

// --- Background Particles (OPTIMIZED FOR NO LAG) ---
function initParticles() {
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray;
    const codeColors = ['#58a6ff', '#79c0ff', '#d2a8ff', '#ff7b72', '#7ee787'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y;
            this.directionX = directionX; this.directionY = directionY;
            this.size = size; this.color = color;
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

    function createParticleArray() {
        particlesArray = [];
        // OPTIMIZATION: Increased divisor from 12000 to 22000 to reduce total particles.
        // This keeps the look but frees up CPU for smooth scrolling.
        let numberOfParticles = (canvas.height * canvas.width) / 22000;

        // CAP: Prevent too many particles on 4K screens which causes lag
        if (numberOfParticles > 80) numberOfParticles = 80;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2.5) + 1;
            let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let randomColor = codeColors[Math.floor(Math.random() * codeColors.length)];
            particlesArray.push(new Particle(x, y, directionX, directionY, size, randomColor));
        }
    }

    function connect() {
        // OPTIMIZATION: Slightly reduced connection distance logic
        // Checks fewer pixels, resulting in higher frame rate
        let connectDistance = (canvas.width / 9) * (canvas.height / 9);

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                if (distance < connectDistance) {
                    let opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(139, 148, 158,' + (opacityValue * 0.6) + ')';
                    ctx.lineWidth = 0.8;
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

    // Debounce resize to prevent memory leak on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            createParticleArray();
        }, 100);
    });

    createParticleArray();
    animateBg();
}

// --- Typewriter Effect ---
function initTypewriter() {
    const typeText = document.getElementById('typewriter-text');
    if (!typeText) return;

    const phrases = ["Business Analyst.", "Supply Chain Specialist.", "Visual Logic."];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typeText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typeText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);
}

// --- 3D Card Tilt ---
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });
}

function initStablePortfolio() {
    const track = document.getElementById('pro-scroll-track');
    const cards = document.querySelectorAll('.pro-glass-card');
    const dots = document.querySelectorAll('.dot');
    const container = document.getElementById('morphing-canvas-container');

    if (!track || !container) return;

    // 1. THREE.JS BOILERPLATE
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(550, 550);
    container.appendChild(renderer.domElement);

    const particleCount = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const themeColor = new THREE.Color(0x00ffd5);
    const outerColor = new THREE.Color(0xffffff);

    const material = new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    camera.position.z = 8;

    // 2. SHAPE MATH
    const getShape = (type) => {
        const pts = [];
        for (let i = 0; i < particleCount; i++) {
            if (type === 'orb') {
                const phi = Math.acos(-1 + (2 * i) / particleCount); const theta = Math.sqrt(particleCount * Math.PI) * phi;
                const r = i % 10 === 0 ? 0.4 : 1.9 + (Math.random() - 0.5) * 0.2;
                pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
            } else if (type === 'lattice') {
                pts.push((Math.floor(Math.random() * 6) - 2.5) * 0.7, (Math.floor(Math.random() * 6) - 2.5) * 0.7, (Math.floor(Math.random() * 6) - 2.5) * 0.7);
            } else if (type === 'web') {
                const t = (i / particleCount) * Math.PI * 2;
                pts.push((Math.sin(t) + 2 * Math.sin(2 * t)) * 0.5, (Math.cos(t) - 2 * Math.cos(2 * t)) * 0.5, Math.sin(3 * t) * 0.5);
            } else if (type === 'prism') {
                const h = Math.random() * 4 - 2; const r = (2 - Math.abs(h)) * 0.6; const a = Math.random() * Math.PI * 2;
                pts.push(Math.cos(a) * r, h, Math.sin(a) * r);
            } else if (type === 'vault') {
                let x = (Math.random() - 0.5) * 3; let y = (Math.random() - 0.5) * 3; let z = (Math.random() - 0.5) * 3;
                if (Math.abs(x) > 1.1 || Math.abs(y) > 1.1 || Math.abs(z) > 1.1) pts.push(x, y, z); else pts.push(0, 0, 0);
            } else { // Ship
                const phi = Math.acos(-1 + (2 * Math.random())); const theta = Math.random() * Math.PI * 2;
                const r = i % 4 === 0 ? 0.5 : 1.8;
                pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
            }
        }
        return pts;
    };

    let currentTarget = getShape('orb');

    // 3. ANIMATION LOOP
    function animate() {
        requestAnimationFrame(animate);
        const pos = points.geometry.attributes.position;
        const col = points.geometry.attributes.color;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            pos.array[i3] += (currentTarget[i3] - pos.array[i3]) * 0.08;
            pos.array[i3 + 1] += (currentTarget[i3 + 1] - pos.array[i3 + 1]) * 0.08;
            pos.array[i3 + 2] += (currentTarget[i3 + 2] - pos.array[i3 + 2]) * 0.08;
            const d = Math.sqrt(pos.array[i3] ** 2 + pos.array[i3 + 1] ** 2 + pos.array[i3 + 2] ** 2);
            const mix = new THREE.Color().copy(themeColor).lerp(outerColor, d / 2.2);
            col.array[i3] = mix.r; col.array[i3 + 1] = mix.g; col.array[i3 + 2] = mix.b;
        }
        pos.needsUpdate = true; col.needsUpdate = true;
        points.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();

    // 4. SCROLL INTERACTION
    track.addEventListener('scroll', () => {
        cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            const center = window.innerWidth / 2;
            if (rect.left < center && rect.right > center) {
                card.classList.add('active');
                dots[i].classList.add('active');
                currentTarget = getShape(card.dataset.shape);
            } else {
                card.classList.remove('active');
                dots[i].classList.remove('active');
            }
        });
    });

    cards.forEach(card => card.addEventListener('click', () => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }));
}

initStablePortfolio();

// --- Three.js (The Core) ---
function initThreeJS() {
    // STOP ON MOBILE
    if (window.innerWidth < 769) return;

    const container = document.getElementById('ai-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. THE INNER CORE (The glowing teal sphere)
    const coreGeo = new THREE.IcosahedronGeometry(0.5, 5);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // 2. THE DENSE OUTER CLOUD (The white star field from image)
    const particlesCount = 15000; // High density
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Create a spherical distribution
        const r = 1.2 + Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);
    }

    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({
        size: 0.005,
        color: 0xffffff,
        transparent: true,
        opacity: 0.4
    });

    const starField = new THREE.Points(partGeo, partMat);
    group.add(starField);

    // 3. CONTROLS (Interact: Drag to Rotate)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Keep the composition intact
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    function animate() {
        requestAnimationFrame(animate);

        // Manual rotation is handled by OrbitControls now
        // group.rotation.y += 0.002; 

        // Pulse effect
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.05;
        core.scale.set(scale, scale, scale);

        controls.update(); // Update controls
        renderer.render(scene, camera);
    }
    animate();
}

// --- Navigation ---
function initNavigation() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    function closeMenu() {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
        }
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars'); icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(item => {
        item.addEventListener('click', closeMenu);
    });
}

/* =========================================
   3. 📄 RECRUITER DETECTOR (UPDATED MODAL)
   ========================================= */
function initDownloadModal() {
    const modal = document.getElementById('download-modal');
    const confirmBtn = document.getElementById('btn-confirm');
    const cancelBtn = document.getElementById('btn-cancel');
    let targetLink = null;

    if (!modal) return;

    document.querySelectorAll('a[href$=".pdf"], a[href$=".pptx"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            targetLink = link.getAttribute('href');
            modal.classList.add('active');
        });
    });

    if (cancelBtn) cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active'); targetLink = null;
    });

    if (confirmBtn) confirmBtn.addEventListener('click', () => {
        if (targetLink) {
            // Send Generic "Resume Downloaded" message
            sendToDiscord(
                "📄 Resume Downloaded!",
                [
                    { name: "File", value: targetLink, inline: true },
                    { name: "Time", value: new Date().toLocaleTimeString(), inline: true }
                ],
                0xFFD700 // Gold Color
            );
            window.open(targetLink, '_blank');
            modal.classList.remove('active');
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

// --- Custom Cursor ---
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.innerWidth > 768) {
        window.addEventListener('mousemove', function (e) {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const hoverTargets = document.querySelectorAll('a, button, .hover-target, i, .tablet-device, .tilt-card');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => { document.body.classList.add('hovering'); });
            el.addEventListener('mouseleave', () => { document.body.classList.remove('hovering'); });
        });
    }
}

/* =========================================
   4. 📨 DIRECT-LINK CONTACT FORM
   ========================================= */
function initDirectContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerText;
        btn.innerText = "Transmitting...";

        sendToDiscord(
            "📨 New Job Inquiry",
            [
                { name: "Name", value: name, inline: true },
                { name: "Email", value: email, inline: true },
                { name: "Message", value: message, inline: false }
            ],
            0x00FF00 // Green
        );

        setTimeout(() => {
            btn.innerText = originalText;
            form.reset();
            statusDiv.style.display = 'block';
            setTimeout(() => { statusDiv.style.display = 'none'; }, 5000);
        }, 1000);
    });
}

/* =========================================
   5. 🕵️ HACKER MODE (KONAMI CODE)
   ========================================= */
function initHackerMode() {
    const konamiCode = [
        "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
        "b", "a"
    ];
    let keyHistory = [];

    window.addEventListener('keydown', (e) => {
        keyHistory.push(e.key);
        if (keyHistory.length > konamiCode.length) keyHistory.shift();
        if (JSON.stringify(keyHistory) === JSON.stringify(konamiCode)) activateHackerMode();
    });
}

function activateHackerMode() {
    document.body.classList.toggle('hacker-mode');
    if (document.body.classList.contains('hacker-mode')) {
        alert("ACCESS GRANTED: MATRIX PROTOCOL INITIATED.");
        sendToDiscord(
            "🕵️ HACKER MODE ACTIVATED",
            [{ name: "Status", value: "User found the Konami Code easter egg!", inline: false }],
            0xFF0000
        );
    }
}

/* =========================================
   6. GLOBAL NOTIFICATION SYSTEMS
   ========================================= */

// Generic Sender (For Resumes & Forms)
function sendToDiscord(title, fields, color = 6619098) {
    const webhookURL = 'https://discord.com/api/webhooks/1444721910284943495/-E6nNrnKRJBPBPQYjzDcqNTsl-JupNP0XMEEwr3a8WuoIrZYvgBQDXdEZmhItLk2G_42';

    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const message = {
                embeds: [{
                    title: title,
                    color: color,
                    fields: [
                        ...fields,
                        { name: "📍 Origin", value: `${data.city}, ${data.country_name}`, inline: true }
                    ],
                    footer: { text: "Jay Damania Portfolio System" },
                    timestamp: new Date()
                }]
            };

            fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });
        })
        .catch(err => console.log("Tracker blocked"));
}

// 🚀 CUSTOM VISIT NOTIFIER (Matches Your Screenshot Exactly)
function notifyVisit() {
    if (sessionStorage.getItem('visited')) return;

    // 1. Get Device Name
    const ua = navigator.userAgent;
    let deviceText = "Unknown Device";
    if (ua.indexOf("Windows NT 10.0") !== -1) deviceText = "Windows 10/11 PC";
    else if (ua.indexOf("Windows NT 6.1") !== -1) deviceText = "Windows 7 PC";
    else if (ua.indexOf("Mac OS X") !== -1) deviceText = "Mac / MacBook";
    else if (ua.indexOf("Android") !== -1) deviceText = "Android Mobile";
    else if (ua.indexOf("iPhone") !== -1) deviceText = "iPhone";
    else if (ua.indexOf("Linux") !== -1) deviceText = "Linux / Desktop";

    // 2. Fetch Data & Format Exactly Like Screenshot
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            const webhookURL = 'https://discord.com/api/webhooks/1444721910284943495/-E6nNrnKRJBPBPQYjzDcqNTsl-JupNP0XMEEwr3a8WuoIrZYvgBQDXdEZmhItLk2G_42';

            const message = {
                embeds: [{
                    title: "🚀 New Portfolio Visit!",
                    color: 0x64ffda, // Neon Green Bar
                    fields: [
                        {
                            name: "🏢 Network / Company",
                            value: data.org || "Unknown ISP",
                            inline: false
                        },
                        {
                            name: "📍 Location",
                            value: `${data.city}, ${data.region}, ${data.country_name}`,
                            inline: false
                        },
                        {
                            name: "Ip Address",
                            value: data.ip,
                            inline: true
                        },
                        {
                            name: "📱 Device",
                            value: deviceText,
                            inline: true
                        }
                    ],
                    footer: { text: "Jay Damania Portfolio System" },
                    timestamp: new Date()
                }]
            };

            fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });

            sessionStorage.setItem('visited', 'true');
        })
        .catch(err => console.error("Tracking Error:", err));
}