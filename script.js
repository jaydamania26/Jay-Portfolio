/* =========================================
   1. MAIN INITIALIZATION
   ========================================= */
window.addEventListener('load', () => {
    
    // Initialize Animation On Scroll Library
    if(typeof AOS !== 'undefined') {
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
    initDownloadModal(); // Updated with Recruiter Detector
    initDirectContactForm(); // Replaces Formspree
    initHackerMode(); // Konami Code

    // Notify Discord (Silent Ping)
    notifyVisit();
});


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
        if(bar) bar.style.width = scrolled + "%";
    });
}

// --- Background Particles ---
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
        let numberOfParticles = (canvas.height * canvas.width) / 12000; 
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
        let connectDistance = (canvas.width/7) * (canvas.height/7);
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                if (distance < connectDistance) {
                    let opacityValue = 1 - (distance/20000);
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

    window.addEventListener('resize', () => { resizeCanvas(); createParticleArray(); });
    createParticleArray(); 
    animateBg();
}

// --- Typewriter Effect ---
function initTypewriter() {
    const typeText = document.getElementById('typewriter-text');
    if (!typeText) return;

    const phrases = ["Digital Intelligence.", "Python Bots.", "Visual Logic.", "System Architecture."];
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
            if(window.innerWidth > 768) {
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

// --- Three.js (The Core) ---
function initThreeJS() {
    const container = document.getElementById('ai-canvas');
    if (!container || typeof THREE === 'undefined') return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2.8; 

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); 
    
    container.innerHTML = ''; 
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; 
    controls.autoRotate = true; 
    controls.autoRotateSpeed = 2.0;

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Core
    const coreGeometry = new THREE.IcosahedronGeometry(0.6, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x64ffda, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending 
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(core);

    // 2. Wireframe
    const wireframeGeometry = new THREE.IcosahedronGeometry(0.65, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x64ffda, wireframe: true, transparent: true, opacity: 0.5 
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    mainGroup.add(wireframe);

    // 3. Shell
    const shellGeometry = new THREE.IcosahedronGeometry(1.3, 1);
    const shellMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xbd93f9, wireframe: true, transparent: true, opacity: 0.3 
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    mainGroup.add(shell);

    // 4. Particles
    const particleCount = 600;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = [];
    for(let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = 0.7 + (Math.random() * 0.9);
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        pPositions.push(x, y, z);
    }
    pGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3));
    const pMaterial = new THREE.PointsMaterial({ 
        color: 0xbd93f9, size: 0.02, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending 
    });
    const particles = new THREE.Points(pGeometry, pMaterial);
    mainGroup.add(particles);

    // 5. Satellite
    const satGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x64ffda });
    const satellite = new THREE.Mesh(satGeo, satMat);
    
    const orbitRingGeo = new THREE.TorusGeometry(1.6, 0.005, 64, 100);
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
        
        // Pulse Core
        const pulse = 1 + Math.sin(time * 2) * 0.05;
        core.scale.set(pulse, pulse, pulse);
        
        // Rotations
        wireframe.rotation.y = time * 0.1; 
        wireframe.rotation.z = time * 0.05;
        shell.rotation.y = -time * 0.15;
        
        // Orbit
        satellite.position.x = Math.cos(time * 1.5) * 1.6;
        satellite.position.z = Math.sin(time * 1.5) * 1.6;
        mainGroup.position.y = Math.sin(time) * 0.1; // Bobbing
        
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if(container) {
            width = container.clientWidth; 
            height = container.clientHeight;
            camera.aspect = width / height; 
            camera.updateProjectionMatrix(); 
            renderer.setSize(width, height);
        }
    });
}

// --- Navigation ---
function initNavigation() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    function closeMenu() {
        if(navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            if(icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
        }
    }

    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if(navLinks.classList.contains('active')){
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
    
    if(!modal) return;

    // Detect clicks on PDF links
    document.querySelectorAll('a[href$=".pdf"], a[href$=".pptx"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            targetLink = link.getAttribute('href'); 
            modal.classList.add('active'); 
        });
    });

    if(cancelBtn) cancelBtn.addEventListener('click', () => { 
        modal.classList.remove('active'); targetLink = null; 
    });
    
    // When User Confirms Download
    if(confirmBtn) confirmBtn.addEventListener('click', () => { 
        if(targetLink) { 
            // 1. Notify Discord about the intent
            sendToDiscord(
                "📄 Resume Downloaded!", 
                [
                    { name: "File", value: targetLink, inline: true },
                    { name: "Time", value: new Date().toLocaleTimeString(), inline: true }
                ],
                0xFFD700 // Gold Color
            );

            // 2. Open the file
            window.open(targetLink, '_blank'); 
            modal.classList.remove('active'); 
        } 
    });
    
    modal.addEventListener('click', (e) => { 
        if(e.target === modal) modal.classList.remove('active'); 
    });
}

// --- Custom Cursor ---
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.innerWidth > 768) {
        window.addEventListener('mousemove', function(e) {
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
    
    if(!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop page reload

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Visual Feedback - "Sending..."
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerText;
        btn.innerText = "Transmitting...";
        
        // Send to Discord
        sendToDiscord(
            "📨 New Job Inquiry",
            [
                { name: "Name", value: name, inline: true },
                { name: "Email", value: email, inline: true },
                { name: "Message", value: message, inline: false }
            ],
            0x00FF00 // Green
        );

        // Reset UI after delay
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
        "ArrowUp", "ArrowUp", 
        "ArrowDown", "ArrowDown", 
        "ArrowLeft", "ArrowRight", 
        "ArrowLeft", "ArrowRight", 
        "b", "a"
    ];
    let keyHistory = [];

    window.addEventListener('keydown', (e) => {
        keyHistory.push(e.key);
        
        // Keep history same length as code
        if (keyHistory.length > konamiCode.length) {
            keyHistory.shift();
        }

        // Check if pattern matches
        if (JSON.stringify(keyHistory) === JSON.stringify(konamiCode)) {
            activateHackerMode();
        }
    });
}

function activateHackerMode() {
    document.body.classList.toggle('hacker-mode');
    
    if (document.body.classList.contains('hacker-mode')) {
        alert("ACCESS GRANTED: MATRIX PROTOCOL INITIATED.");
        
        // Notify Discord of this rare event
        sendToDiscord(
            "🕵️ HACKER MODE ACTIVATED",
            [{ name: "Status", value: "User found the Konami Code easter egg!", inline: false }],
            0xFF0000 // Red
        );
    }
}

/* =========================================
   6. GLOBAL DISCORD NOTIFICATION SYSTEM
   ========================================= */
function sendToDiscord(title, fields, color = 6619098) {
    // ⚠️ YOUR WEBHOOK URL HERE
    const webhookURL = 'https://discord.com/api/webhooks/1444721910284943495/-E6nNrnKRJBPBPQYjzDcqNTsl-JupNP0XMEEwr3a8WuoIrZYvgBQDXdEZmhItLk2G_42';

    // Get Basic Visitor Info
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
            }).catch(console.error);
        })
        .catch(err => console.log("Tracker blocked by adblocker - skipping location data"));
}

// Initial Visitor Ping
function notifyVisit() {
    if(sessionStorage.getItem('visited')) return;
    
    sendToDiscord(
        "🚀 New Portfolio Visit", 
        [{ name: "Page", value: "Index.html", inline: true }]
    );
    sessionStorage.setItem('visited', 'true');
}