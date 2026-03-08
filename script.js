// =====================================================
// THREE.JS PARTICLE BACKGROUND
// =====================================================
(function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Particles
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
        { r: 0, g: 0.83, b: 1 },       // cyan
        { r: 0.49, g: 0.23, b: 0.93 },  // purple
        { r: 0.93, g: 0.29, b: 0.6 },   // pink
        { r: 0.06, g: 0.73, b: 0.51 },  // green
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 3 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connecting lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(300 * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.06,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.0005;

        particles.rotation.y = time * 0.15 + mouseX * 0.1;
        particles.rotation.x = time * 0.1 + mouseY * 0.1;

        // Update particle positions subtly
        const posArray = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.001;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Update connecting lines
        let lineIdx = 0;
        const linePos = lines.geometry.attributes.position.array;
        for (let i = 0; i < Math.min(particleCount, 100); i++) {
            for (let j = i + 1; j < Math.min(particleCount, 100); j++) {
                if (lineIdx >= 300) break;
                const dx = posArray[i * 3] - posArray[j * 3];
                const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
                const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < 1.5) {
                    linePos[lineIdx * 6] = posArray[i * 3];
                    linePos[lineIdx * 6 + 1] = posArray[i * 3 + 1];
                    linePos[lineIdx * 6 + 2] = posArray[i * 3 + 2];
                    linePos[lineIdx * 6 + 3] = posArray[j * 3];
                    linePos[lineIdx * 6 + 4] = posArray[j * 3 + 1];
                    linePos[lineIdx * 6 + 5] = posArray[j * 3 + 2];
                    lineIdx++;
                }
            }
            if (lineIdx >= 300) break;
        }
        lines.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();


// =====================================================
// TYPEWRITER EFFECT
// =====================================================
(function initTypewriter() {
    const phrases = [
        'Frontend Developer Specializing in Modern & Responsive Websites',
        'WordPress & Frontend Developer Helping Businesses Grow Online',
        'I Build Clean, Fast & SEO-Friendly Websites',
        'Machine Learning Enthusiast & Content Creator',
        'Bridging the Gap Between Business & Technology'
    ];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;
    const el = document.getElementById('typewriter');

    function type() {
        const current = phrases[phraseIdx];
        if (isDeleting) {
            el.textContent = current.substring(0, charIdx--);
        } else {
            el.textContent = current.substring(0, charIdx++);
        }

        let delay = isDeleting ? 30 : 80;

        if (!isDeleting && charIdx === current.length + 1) {
            delay = 2500;
            isDeleting = true;
        } else if (isDeleting && charIdx < 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay = 500;
        }

        setTimeout(type, delay);
    }
    type();
})();


// =====================================================
// NAVBAR SCROLL EFFECT
// =====================================================
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-cta)');

    window.addEventListener('scroll', () => {
        // Scrolled state
        navbar.classList.toggle('scrolled', window.scrollY > 60);

        // Active section highlight
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.getElementById('nav-links');

    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });
})();


// =====================================================
// SCROLL REVEAL ANIMATIONS
// =====================================================
(function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// =====================================================
// COUNT-UP ANIMATION
// =====================================================
(function initCountUp() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const isDecimal = el.dataset.decimal === 'true';
                const duration = 2000;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    const current = eased * target;
                    el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
})();


// =====================================================
// SKILL BAR ANIMATION
// =====================================================
(function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.dataset.width;
                fill.style.setProperty('--target-width', width + '%');
                fill.classList.add('animated');
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-fill').forEach(el => observer.observe(el));
})();


// =====================================================
// 3D TILT EFFECT ON CARDS
// =====================================================
(function initTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPercent = (x / rect.width - 0.5) * 2;
            const yPercent = (y / rect.height - 0.5) * 2;

            card.style.transform = `perspective(800px) rotateY(${xPercent * 5}deg) rotateX(${-yPercent * 5}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
        });
    });
})();


// =====================================================
// CHATBOT
// =====================================================
(function initChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const window_ = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const messages = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input-field');
    const sendBtn = document.getElementById('chatbot-send');
    const quickBtns = document.querySelectorAll('.quick-btn');
    const badge = toggle.querySelector('.chatbot-badge');

    const responses = {
        skills: "Areeba is skilled in 🌐 WordPress Development (90%), 🔍 SEO & Backlinking (88%), 📱 Social Media Marketing (85%), 🐍 Python & ML (80%), 💻 C/C++/DSA (80%), 📋 MS Office (92%), 🎬 Video Editing (82%), and more! She's a versatile tech professional. 💪",
        projects: "Areeba has worked on 10+ projects including:\n🚗 Car Showroom Management\n📝 Blogging Website\n🎮 Gaming Info Site\n🧠 Flashcard Quiz App (3D Web App)\n🏔️ Skardu Food Street\n🍖 Azan BBQ\n💎 Zarkane PK\nCheck the Projects section for details! 🚀",
        experience: "Areeba has 3+ professional roles:\n💼 WordPress Developer @ Appverse Technologies\n🖥️ Web Developer @ Arch Technologies\n🔗 SEO Specialist @ WebAce Solution\n📱 SMM Specialist @ Web Marketing Solutions\n🌐 WP Developer Intern @ Itsolera\nShe's been building real-world skills since university! 🎓",
        contact: "You can reach Areeba at:\n📞 0307-7073442\n✉️ areebasajjad.2004@gmail.com\n💼 LinkedIn: Areeba Sajjad\n📸 Instagram: @areebasajjad\n🐙 GitHub: Cora12345678\nOr use the contact form on this page! 📨",
        hi: "Hey there! 👋 Welcome to Areeba's portfolio. I can tell you about her skills, projects, work experience, or how to get in touch. What interests you?",
        hello: "Hello! 😊 I'm ARIA, Areeba's AI assistant. Feel free to ask me about her work, education, or anything else!",
        education: "🎓 Areeba is pursuing her Bachelor's in Business & IT (BBIT) at IBIT, University of Punjab, Lahore. She's in her 8th semester with a CGPA of 3.50! She completed her intermediate (FSc ICS Physics) from Kinnaird College with A+ grade.",
        cgpa: "Areeba's current CGPA is 3.50 — maintained throughout her BBIT degree at IBIT, University of Punjab. Pretty impressive! 🌟",
        wordpress: "WordPress is one of Areeba's strongest skills (90%)! She's currently working as a WP Developer at both Appverse Technologies and as an intern at Itsolera. She builds custom themes, manages plugins, and ensures SEO-friendly responsive designs. 🌐",
        seo: "Areeba is an SEO expert (88%)! She worked at WebAce Solution as an SEO Backlinking Specialist, building high-quality backlinks for clients. She also wrote an article on '17 Backlinking Strategies That Actually Work in 2026'. 🔍",
    };

    function addMessage(text, isBot = true) {
        const div = document.createElement('div');
        div.className = `chat-msg ${isBot ? 'bot' : 'user'}`;
        div.innerHTML = `
            <span class="chat-avatar">${isBot ? '🤖' : '👤'}</span>
            <p>${text.replace(/\n/g, '<br>')}</p>
        `;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function getResponse(query) {
        const q = query.toLowerCase().trim();
        for (const [key, value] of Object.entries(responses)) {
            if (q.includes(key)) return value;
        }
        if (q.includes('about') || q.includes('who')) {
            return "Areeba Sajjad is a BBIT student at IBIT, University of Punjab. She specializes in IT with a 3.50 CGPA. She's a WordPress Developer, SEO Specialist, Social Media Marketer, and Content Creator with 3+ professional roles! 🌟";
        }
        return "Great question! 🤔 I can help you with info about Areeba's skills, projects, experience, education, or contact details. Try asking about one of those, or use the quick buttons below!";
    }

    toggle.addEventListener('click', () => {
        window_.classList.toggle('open');
        badge.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        window_.classList.remove('open');
    });

    function handleSend() {
        const text = inputField.value.trim();
        if (!text) return;
        addMessage(text, false);
        inputField.value = '';
        setTimeout(() => addMessage(getResponse(text)), 600);
    }

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.dataset.query;
            addMessage(btn.textContent, false);
            setTimeout(() => addMessage(responses[query] || getResponse(query)), 600);
        });
    });
})();


// =====================================================
// CONTACT FORM (STANDARD SUBMISSION)
// =====================================================
(function initContactForm() {
    // We are using the standard HTML form action for now 
    // to ensure you see the FormSubmit confirmation page.
    console.log("Contact form ready for standard submission.");
})();


// =====================================================
// SMOOTH SCROLL FOR NAV LINKS
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
