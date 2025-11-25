/* =========================================
   1. INITIALIZATION & GLOBALS
   ========================================= */
window.addEventListener('load', () => {
    
    // Init AOS
    if(typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: false, mirror: false, offset: 100, easing: 'ease-out-cubic' });
    }

    /* =========================================
       2. CANVAS BACKGROUND (BRIGHT & VISIBLE)
       ========================================= */
    const canvas = document.getElementById('canvas-bg');
    if (canvas) {
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

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000; 
            
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
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
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

        window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
        initParticles(); animateBg();
    }

    /* =========================================
       3. 3D NEURAL CORE (KINETIC ENERGY EDITION)
       ========================================= */
    const container = document.getElementById('ai-canvas');
    if (container && typeof THREE !== 'undefined') {
        let width = container.clientWidth || 500;
        let height = container.clientHeight || 500;

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 2.8; 

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio); 
        container.innerHTML = ''; 
        container.appendChild(renderer.domElement);

        // Controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; 
        controls.dampingFactor = 0.05;
        controls.enableZoom = false; 
        controls.enableRotate = true; 
        controls.autoRotate = true; 
        controls.autoRotateSpeed = 2.0;

        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // --- OBJECTS ---

        // 1. The Core (Inner Solid)
        const coreGeometry = new THREE.IcosahedronGeometry(0.6, 2);
        const coreMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x64ffda, // Base Cyan
            transparent: true, 
            opacity: 0.8, 
            blending: THREE.AdditiveBlending 
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        mainGroup.add(core);

        // 2. The Wireframe Shield
        const wireframeGeometry = new THREE.IcosahedronGeometry(0.65, 1);
        const wireframeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x64ffda, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.5 
        });
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        mainGroup.add(wireframe);

        // 3. The Outer Shell
        const shellGeometry = new THREE.IcosahedronGeometry(1.3, 1);
        const shellMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xbd93f9, // Purple
            wireframe: true, 
            transparent: true, 
            opacity: 0.2 
        });
        const shell = new THREE.Mesh(shellGeometry, shellMaterial);
        mainGroup.add(shell);

        // 4. Particles Cloud
        const particleCount = 1200;
        const pGeometry = new THREE.BufferGeometry();
        const pPositions = [];
        const originalPPositions = []; // Store original to expand later

        for(let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 0.7 + (Math.random() * 0.7); 
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            pPositions.push(x, y, z);
            originalPPositions.push({x, y, z});
        }
        
        const positionAttribute = new THREE.Float32BufferAttribute(pPositions, 3);
        pGeometry.setAttribute('position', positionAttribute);
        
        const pMaterial = new THREE.PointsMaterial({ 
            color: 0xbd93f9, 
            size: 0.02, 
            transparent: true, 
            opacity: 0.8, 
            blending: THREE.AdditiveBlending 
        });
        const particles = new THREE.Points(pGeometry, pMaterial);
        mainGroup.add(particles);

        // 5. Satellite
        const satGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const satMat = new THREE.MeshBasicMaterial({ color: 0x64ffda });
        const satellite = new THREE.Mesh(satGeo, satMat);
        const orbitRingGeo = new THREE.TorusGeometry(1.6, 0.005, 16, 100);
        const orbitRingMat = new THREE.MeshBasicMaterial({ color: 0x64ffda, opacity: 0.4, transparent: true });
        const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
        orbitRing.rotation.x = Math.PI / 2;
        
        const satelliteGroup = new THREE.Group();
        satelliteGroup.add(satellite);
        satelliteGroup.add(orbitRing);
        satelliteGroup.rotation.z = Math.PI / 4; 
        satelliteGroup.rotation.x = Math.PI / 6;
        scene.add(satelliteGroup);

        // --- INTERACTION LOGIC (THE GLOW) ---
        let energyLevel = 0; // 0 = Calm, 1 = Full Power
        let isInteracting = false;

        // Detect user interaction
        controls.addEventListener('start', () => { isInteracting = true; });
        controls.addEventListener('end', () => { isInteracting = false; });

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            controls.update(); 
            
            const time = clock.getElapsedTime();
            
            // 1. Calculate Energy Logic
            if (isInteracting) {
                // If dragging, ram energy up quickly
                energyLevel += 0.05; 
            } else {
                // If let go, cool down slowly
                energyLevel -= 0.02; 
            }
            // Clamp energy between 0 and 1
            energyLevel = Math.max(0, Math.min(1, energyLevel));

            // 2. Apply "Beautiful" Effects based on Energy
            
            // A. Core turns from Cyan(Greenish) to White
            const baseColor = new THREE.Color(0x64ffda); // Cyan
            const activeColor = new THREE.Color(0xffffff); // White
            coreMaterial.color.lerpColors(baseColor, activeColor, energyLevel);
            coreMaterial.opacity = 0.8 + (0.2 * energyLevel); // Becomes solid

            // B. Wireframe turns from Cyan to Bright Purple/Pink
            const wireBase = new THREE.Color(0x64ffda);
            const wireActive = new THREE.Color(0xff00ff); // Hot Pink
            wireframeMaterial.color.lerpColors(wireBase, wireActive, energyLevel);
            wireframeMaterial.opacity = 0.5 + (0.5 * energyLevel);

            // C. Pulse/Scale Effect
            const basePulse = 1 + Math.sin(time * 2) * 0.05;
            const extraScale = energyLevel * 0.3; // Grow 30% larger when shaken
            const totalScale = basePulse + extraScale;
            
            core.scale.setScalar(totalScale);
            wireframe.scale.setScalar(totalScale); // Wireframe grows too

            // D. Particles Explode Outward
            const positions = particles.geometry.attributes.position.array;
            const expansionFactor = 1 + (energyLevel * 0.5); // Particles expand 50% out
            
            for(let i = 0; i < particleCount; i++) {
                // Calculate new position based on original position * expansion
                const ox = originalPPositions[i].x;
                const oy = originalPPositions[i].y;
                const oz = originalPPositions[i].z;
                
                positions[i * 3] = ox * expansionFactor;
                positions[i * 3 + 1] = oy * expansionFactor;
                positions[i * 3 + 2] = oz * expansionFactor;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            
            // E. Standard Animations (Rotations)
            // Spin faster if high energy
            const speedMult = 1 + (energyLevel * 2); 
            
            wireframe.rotation.y = time * 0.1 * speedMult; 
            wireframe.rotation.z = time * 0.05 * speedMult;
            shell.rotation.y = -time * 0.15;
            
            satellite.position.x = Math.cos(time * 1.5) * 1.6;
            satellite.position.y = Math.sin(time * 1.5) * 1.6;
            
            mainGroup.position.y = Math.sin(time) * 0.1;

            renderer.render(scene, camera);
        }
        animate();

        // Responsive
        window.addEventListener('resize', () => {
            if(container) {
                width = container.clientWidth; height = container.clientHeight;
                camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height);
            }
        });
    }

    /* =========================================
       4. MOBILE MENU & DOWNLOAD MODAL
       ========================================= */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            navLinks.classList.contains('active') ? (icon.classList.remove('fa-bars'), icon.classList.add('fa-times')) : (icon.classList.remove('fa-times'), icon.classList.add('fa-bars'));
        });
    }
    const modal = document.getElementById('download-modal');
    const confirmBtn = document.getElementById('btn-confirm');
    const cancelBtn = document.getElementById('btn-cancel');
    let targetLink = null;
    if(modal) {
        document.querySelectorAll('a[href$=".pdf"], a[href$=".pptx"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); targetLink = link.getAttribute('href'); modal.classList.add('active'); 
            });
        });
        if(cancelBtn) cancelBtn.addEventListener('click', () => { modal.classList.remove('active'); targetLink = null; });
        if(confirmBtn) confirmBtn.addEventListener('click', () => { if(targetLink) { window.open(targetLink, '_blank'); modal.classList.remove('active'); } });
        modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('active'); });
    }
    
    // Timeline Scroll Observer
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('active'); } 
            else { entry.target.classList.remove('active'); }
        });
    }, { threshold: 0.5, rootMargin: "0px 0px -20% 0px" });
    document.querySelectorAll('.active-on-scroll').forEach(item => { timelineObserver.observe(item); });
});