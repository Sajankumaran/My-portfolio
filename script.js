// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Initially make the hero section visible immediately
    const hero = document.getElementById('hero');
    if(hero) {
        setTimeout(() => {
            hero.classList.add('visible');
        }, 100);
    }
});

// Remove loader when fully loaded
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 600);
    }
});

// Update Nav on Scroll (Glassmorphism effect strengthening)
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.glass-nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(15, 23, 42, 0.85)';
        nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        nav.style.backdropFilter = 'blur(20px)';
    } else {
        nav.style.background = 'rgba(15, 23, 42, 0.6)';
        nav.style.boxShadow = 'none';
        nav.style.backdropFilter = 'blur(16px)';
    }
});

// Parallax Scrolling Effect
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-speed');
        el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });
});

// Spotlight Hover Effect
const cards = document.querySelectorAll('.card-spotlight');
cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Particle Network Background
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.01;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Interaction
        if (mouse.x && mouse.y) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                this.x -= dx / 20;
                this.y -= dy / 20;
            }
        }
    }
    draw() {
        ctx.fillStyle = 'rgba(96, 165, 250, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    let numParticles = (canvas.width * canvas.height) / 10000;
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                         + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                let opacity = 1 - (distance / 20000);
                if(opacity < 0) opacity = 0;
                ctx.strokeStyle = `rgba(192, 132, 252, ${opacity * 0.15})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
