
/* =========================================
   GLOBAL NEURAL CORE SYSTEM (Unified 3D Logic)
   ========================================= */
class NeuralGlobalSystem {
    constructor() {
        this.canvas = document.getElementById('global-neural-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.camera.position.z = 5;

        // STATE
        this.particleCount = window.innerWidth < 768 ? 8000 : 15000;
        this.mouse = new THREE.Vector2();
        this.mouse3D = new THREE.Vector3();
        this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.raycaster = new THREE.Raycaster();

        // ORBIT CONTROLS
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.0;
        this.controls.enabled = false;

        // INITIALIZE
        this.createParticles();
        this.createCoreSphere();
        this.initEventListeners();

        this.animate();
        this.checkScrollSection();
    }

    createCoreSphere() {
        const geometry = new THREE.IcosahedronGeometry(0.5, 4);
        const material = new THREE.MeshBasicMaterial({
            color: 0x64ffda,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        this.coreSphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.coreSphere);
    }

    createParticles() {
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);

        const orb = this.getOrb(); // Start with Orb shape

        for (let i = 0; i < this.particleCount * 3; i += 3) {
            positions[i] = orb[i];
            positions[i + 1] = orb[i + 1];
            positions[i + 2] = orb[i + 2];

            colors[i] = 1; colors[i + 1] = 1; colors[i + 2] = 1;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: window.innerWidth < 768 ? 0.04 : 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(this.geometry, material);
        this.scene.add(this.particles);

        this.currentPositions = positions.slice();
        this.targetPositions = positions.slice();
    }

    // --- SHAPES ---
    getOrb() {
        const pts = [];
        for (let i = 0; i < this.particleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / this.particleCount);
            const theta = Math.sqrt(this.particleCount * Math.PI) * phi;
            const r = i % 10 === 0 ? 0.5 : 2.0 + (Math.random() - 0.5) * 0.2;
            pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        }
        return new Float32Array(pts);
    }

    getLattice() {
        const pts = [];
        for (let i = 0; i < this.particleCount; i++) {
            const x = (Math.floor(Math.random() * 5) - 2) * 0.8;
            const y = (Math.floor(Math.random() * 5) - 2) * 0.8;
            const z = (Math.floor(Math.random() * 5) - 2) * 0.8;
            pts.push(x + (Math.random() - 0.5) * 0.2, y + (Math.random() - 0.5) * 0.2, z + (Math.random() - 0.5) * 0.2);
        }
        return new Float32Array(pts);
    }

    getWeb() {
        const pts = [];
        for (let i = 0; i < this.particleCount; i++) {
            const t = (i / this.particleCount) * Math.PI * 2;
            pts.push(
                (Math.sin(t) + 2 * Math.sin(2 * t)) * 0.7 + (Math.random() - 0.5) * 0.1,
                (Math.cos(t) - 2 * Math.cos(2 * t)) * 0.7 + (Math.random() - 0.5) * 0.1,
                -Math.sin(3 * t) * 0.7 + (Math.random() - 0.5) * 0.1
            );
        }
        return new Float32Array(pts);
    }

    getPrism() {
        const pts = [];
        for (let i = 0; i < this.particleCount; i++) {
            const h = (Math.random() - 0.5) * 4;
            const r = (2 - Math.abs(h)) * 0.8;
            const angle = Math.random() * Math.PI * 2;
            pts.push(Math.cos(angle) * r, h, Math.sin(angle) * r);
        }
        return new Float32Array(pts);
    }

    getVault() {
        const pts = [];
        for (let i = 0; i < this.particleCount; i++) {
            let x = (Math.random() - 0.5) * 3;
            let y = (Math.random() - 0.5) * 3;
            let z = (Math.random() - 0.5) * 3;
            if (Math.abs(x) > 1.2 || Math.abs(y) > 1.2 || Math.abs(z) > 1.2)
                pts.push(x, y, z);
            else
                pts.push((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2);
        }
        return new Float32Array(pts);
    }

    getLogisticsDome() {
        const pts = [];
        for (let i = 0; i < this.particleCount; i++) {
            const phi = Math.acos(-1 + (2 * Math.random()));
            const theta = Math.random() * Math.PI * 2;
            const r = i % 3 === 0 ? 0.5 + Math.random() * 0.3 : 1.8 + (Math.random() - 0.5) * 0.2;
            pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        }
        return new Float32Array(pts);
    }

    setTargetShape(shapeName) {
        let pts = null;
        switch (shapeName) {
            case 'orb': pts = this.getOrb(); break;
            case 'lattice': pts = this.getLattice(); break;
            case 'web': pts = this.getWeb(); break;
            case 'prism': pts = this.getPrism(); break;
            case 'vault': pts = this.getVault(); break;
            case 'ship': pts = this.getLogisticsDome(); break;
            default: pts = this.getOrb(); break;
        }

        if (pts) {
            for (let i = 0; i < pts.length; i++) {
                this.targetPositions[i] = pts[i];
            }
        }
    }

    updateParticles() {
        const positions = this.particles.geometry.attributes.position.array;

        for (let i = 0; i < this.particleCount * 3; i++) {
            // Morphing
            positions[i] += (this.targetPositions[i] - positions[i]) * 0.05;
        }

        // Mouse Repulsion (only when not interacting)
        if (!this.controls.enabled && window.innerWidth > 768) {
            for (let i = 0; i < this.particleCount * 3; i += 3) {
                const dx = positions[i] - this.mouse3D.x;
                const dy = positions[i + 1] - this.mouse3D.y;
                const dz = positions[i + 2] - this.mouse3D.z;
                const dist = dx * dx + dy * dy + dz * dz;

                if (dist < 1.4) {
                    const force = (1.4 - dist) * 0.05;
                    positions[i] += dx * force;
                    positions[i + 1] += dy * force;
                    positions[i + 2] += dz * force;
                }
            }
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updateParticles();

        if (this.controls.enabled) {
            this.controls.update();
            this.coreSphere.visible = true;
            // Ensure core rotates with particles
            this.coreSphere.rotation.copy(this.particles.rotation);
        } else {
            this.particles.rotation.y += 0.002;
            this.coreSphere.visible = false;
        }

        // Pulse
        const scale = 1 + Math.sin(Date.now() * 0.003) * 0.08;
        this.coreSphere.scale.set(scale, scale, scale);

        this.renderer.render(this.scene, this.camera);
    }

    initEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            this.raycaster.ray.intersectPlane(this.plane, this.mouse3D);
        });

        window.addEventListener('scroll', () => this.checkScrollSection());

        const track = document.getElementById('project-track');
        if (track) {
            track.addEventListener('scroll', () => {
                const cards = document.querySelectorAll('.glass-card');
                const center = window.innerWidth / 2;
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    if (rect.left < center && rect.right > center) {
                        this.setTargetShape(card.dataset.shape);
                    }
                });
            });
        }
    }

    checkScrollSection() {
        const scrollY = window.scrollY;

        const coreSection = document.getElementById('tech-core');
        const projectsAndBeyond = document.getElementById('projects');

        if (coreSection) {
            const top = coreSection.offsetTop;
            const height = coreSection.offsetHeight;
            if (scrollY > top - window.innerHeight / 2 && scrollY < top + height / 2) {
                // IN NEURAL CORE
                if (!this.controls.enabled) {
                    this.controls.enabled = true;
                    this.setTargetShape('orb');
                }
                return;
            }
        }

        if (projectsAndBeyond && scrollY > projectsAndBeyond.offsetTop - window.innerHeight) {
            // IN PROJECTS
            this.controls.enabled = false;
            // Shape handled by track listneer
            return;
        }

        // DEFAULT (Hero / About)
        this.controls.enabled = false;
        if (scrollY < window.innerHeight) {
            this.setTargetShape('orb');
        } else {
            this.setTargetShape('lattice'); // Change to lattice for 'About'
        }
    }
}

function initGlobalNeuralCore() {
    // SINGLETON: Only init if not already done
    if (window.neuralSystem) return;
    window.neuralSystem = new NeuralGlobalSystem();
}
