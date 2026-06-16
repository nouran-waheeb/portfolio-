/**
 * Mohamed Ekramy — Cybersecurity Portfolio
 * Main JavaScript — Animations, Interactivity & UX
 */

(function () {
  'use strict';

  /* --- SVG Gradient for Skill Rings --- */
  const svgNS = 'http://www.w3.org/2000/svg';
  const gradSvg = document.createElementNS(svgNS, 'svg');
  gradSvg.setAttribute('width', '0');
  gradSvg.setAttribute('height', '0');
  gradSvg.style.position = 'absolute';
  gradSvg.innerHTML = `
    <defs>
      <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00d4ff"/>
        <stop offset="100%" stop-color="#3b82f6"/>
      </linearGradient>
    </defs>`;
  document.body.prepend(gradSvg);

  /* --- DOM References --- */
  const loader = document.getElementById('loader');
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const backToTop = document.getElementById('backToTop');
  const scrollProgressBar = document.querySelector('.scroll-progress-bar');
  const scrollProgress = document.querySelector('.scroll-progress');
  const mouseGlow = document.getElementById('mouseGlow');
  const typingEl = document.getElementById('typingText');
  const contactForm = document.getElementById('contactForm');
  const newsletterForm = document.getElementById('newsletterForm');
  const projectModal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const particlesCanvas = document.getElementById('particles');

  /* --- Loading Screen --- */
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 2000);
  });

  /* --- Theme Toggle --- */
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* --- Mobile Navigation --- */
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* --- Navbar Scroll Effect --- */
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    backToTop.classList.toggle('visible', scrollY > 400);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgressBar.style.width = progress + '%';
    scrollProgress.setAttribute('aria-valuenow', Math.round(progress));

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --- Active Nav Link --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(section => sectionObserver.observe(section));

  /* --- Back to Top --- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --- Typing Effect --- */
  const titles = [
    'Cybersecurity Intern & Aspiring Penetration Tester',
    'Ethical Hacking / Red Team Specialist',
    'OSINT & Reconnaissance Enthusiast'
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingPaused = false;

  function typeEffect() {
    if (!typingEl || typingPaused) return;

    const current = titles[titleIndex];

    if (!isDeleting) {
      typingEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2500);
        return;
      }
    } else {
      typingEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
      }
    }

    setTimeout(typeEffect, isDeleting ? 40 : 80);
  }

  setTimeout(typeEffect, 2200);

  /* --- Scroll Reveal --- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* --- Animated Counters --- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.dataset.target, 10);
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        stat.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    const counterObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          animateCounters();
          counterObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(statsSection);
  }

  /* --- Skill Rings Animation --- */
  const circumference = 2 * Math.PI * 42;

  function animateSkillRings() {
    document.querySelectorAll('.skill-panel.active .skill-card').forEach(card => {
      const level = parseInt(card.dataset.level, 10);
      const ring = card.querySelector('.ring-fill');
      if (ring && !ring.dataset.animated) {
        ring.dataset.animated = 'true';
        const offset = circumference - (level / 100) * circumference;
        ring.style.strokeDashoffset = offset;
      }
    });

    document.querySelectorAll('.skill-panel.active .soft-skill-fill').forEach(bar => {
      const level = parseInt(bar.dataset.level, 10);
      if (!bar.dataset.animated) {
        bar.dataset.animated = 'true';
        bar.style.width = level + '%';
      }
    });
  }

  document.querySelectorAll('.skill-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + tab.dataset.tab);
      if (panel) {
        panel.classList.add('active');
        setTimeout(animateSkillRings, 100);
      }
    });
  });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          animateSkillRings();
          skillsObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    skillsObserver.observe(skillsSection);
  }

  /* --- Project Filtering --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'fadeIn 0.4s ease';
        }
      });
    });
  });

  /* --- Project Modal --- */
  const projectData = {
    metro: {
      title: 'Metro App',
      category: 'Android Development',
      image: 'assets/images/metro-app.svg',
      description: 'Developed an Android Metro application as part of my mobile development journey. The project strengthened my understanding of application structure, user interaction, implementation practices, and software development workflows.',
      role: 'Developer',
      skills: ['Android Development', 'Kotlin Programming', 'UI Implementation', 'Mobile App Architecture'],
      tech: ['Kotlin', 'Android SDK', 'Material Design']
    }
  };

  function openModal(projectId) {
    const project = projectData[projectId];
    if (!project) return;

    modalBody.innerHTML = `
      <img src="${project.image}" alt="${project.title}" style="width:100%;border-radius:12px;margin-bottom:24px;">
      <span class="project-category">${project.category}</span>
      <h2 id="modalTitle" style="font-size:1.75rem;margin:8px 0 16px;">${project.title}</h2>
      <p style="color:var(--text-secondary);margin-bottom:20px;line-height:1.8;">${project.description}</p>
      <p style="margin-bottom:8px;"><strong>Role:</strong> ${project.role}</p>
      <div style="margin-bottom:20px;">
        <strong>Skills Demonstrated:</strong>
        <ul style="margin-top:8px;padding-left:20px;color:var(--text-secondary);">
          ${project.skills.map(s => `<li style="margin-bottom:4px;">${s}</li>`).join('')}
        </ul>
      </div>
      <div class="project-tags" style="margin-bottom:24px;">
        ${project.tech.map(t => `<span>${t}</span>`).join('')}
      </div>
      <div class="project-links">
        <a href="#" class="btn btn-sm btn-outline">GitHub</a>
        <a href="#" class="btn btn-sm btn-primary">Live Demo</a>
      </div>`;

    projectModal.hidden = false;
    document.body.style.overflow = 'hidden';
    projectModal.querySelector('.modal-close').focus();
  }

  function closeModal() {
    projectModal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-view-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal(btn.dataset.project);
    });
  });

  projectModal.querySelector('.modal-close').addEventListener('click', closeModal);
  projectModal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !projectModal.hidden) closeModal();
  });

  /* --- Testimonial Slider --- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.querySelector('.testimonial-btn.prev');
  const nextBtn = document.querySelector('.testimonial-btn.next');
  let currentSlide = 0;
  let slideInterval;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.testimonial-dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  startAutoSlide();

  /* --- Contact Form --- */
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const subject = formData.get('subject').trim();
    const message = formData.get('message').trim();

    if (!name || !email || !subject || !message) {
      status.textContent = 'Please fill in all fields.';
      status.className = 'form-status error';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'form-status error';
      return;
    }

    const mailtoLink = `mailto:mohamedd.ekramyy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;

    status.textContent = 'Opening your email client...';
    status.className = 'form-status success';
    contactForm.reset();
  });

  /* --- Newsletter --- */
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input.value.trim()) {
        input.value = '';
        input.placeholder = 'Thanks for subscribing!';
        setTimeout(() => { input.placeholder = 'Your email'; }, 3000);
      }
    });
  }

  /* --- Mouse Glow Effect --- */
  if (mouseGlow && window.matchMedia('(pointer: fine)').matches) {
    let glowX = 0;
    let glowY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', e => {
      glowX = e.clientX;
      glowY = e.clientY;
    });

    function animateGlow() {
      currentX += (glowX - currentX) * 0.08;
      currentY += (glowY - currentY) * 0.08;
      mouseGlow.style.left = currentX + 'px';
      mouseGlow.style.top = currentY + 'px';
      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  /* --- Particle Network Background --- */
  if (particlesCanvas) {
    const ctx = particlesCanvas.getContext('2d');
    let particles = [];
    let animationId;
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 150;
    const mouse = { x: null, y: null, radius: 120 };

    function resizeCanvas() {
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (mouse.x !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 2;
            this.y += (dy / dist) * force * 2;
          }
        }

        if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
      }

      draw() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? `rgba(59, 130, 246, ${this.opacity})`
          : `rgba(0, 212, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = isLight
              ? `rgba(59, 130, 246, ${opacity})`
              : `rgba(0, 212, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      animationId = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    if (window.matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });

      document.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      cancelAnimationFrame(animationId);
      particlesCanvas.style.display = 'none';
    }
  }

  /* --- Smooth anchor scroll with offset --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
