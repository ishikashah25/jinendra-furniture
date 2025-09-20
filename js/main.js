// Smooth scroll for anchor links
const links = document.querySelectorAll('a[href^="#"]');
for (const link of links) {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Hero Slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
const prevBtn = document.getElementById('hero-prev');
const nextBtn = document.getElementById('hero-next');
let slideInterval;

function showSlide(index) {
  // Remove active class from all slides and dots
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  // Add active class to current slide and dot
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  
  currentSlide = index;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function startSlider() {
  slideInterval = setInterval(nextSlide, 4000); // Auto-slide every 4 seconds
}

function stopSlider() {
  clearInterval(slideInterval);
}

// Event listeners for slider controls
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    stopSlider();
    nextSlide();
    startSlider();
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    stopSlider();
    prevSlide();
    startSlider();
  });
}

// Event listeners for dots
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    stopSlider();
    showSlide(index);
    startSlider();
  });
});

// Pause slider on hover
const heroSlider = document.getElementById('hero-slider');
if (heroSlider) {
  heroSlider.addEventListener('mouseenter', stopSlider);
  heroSlider.addEventListener('mouseleave', startSlider);
}

// Initialize slider
if (slides.length > 0) {
  showSlide(0);
  startSlider();
}

// Hamburger menu toggle for mobile
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// Highlight active section in navbar
const navLinks = document.querySelectorAll('.nav-link');
const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));
window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + 100;
  sections.forEach((section, idx) => {
    if (section && section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
      navLinks.forEach(link => link.classList.remove('active-link'));
      navLinks[idx].classList.add('active-link');
    }
  });
});

// Mobile Gallery Auto-slide functionality
let mobileGalleryInterval;
let currentMobileSlide = 0;
const mobileGallery = document.querySelector('.mobile-gallery-scroll');
const mobileGalleryItems = document.querySelectorAll('.mobile-gallery-scroll > a');

function startMobileGallerySlide() {
  if (window.innerWidth <= 640 && mobileGalleryItems.length > 0) {
    mobileGalleryInterval = setInterval(() => {
      currentMobileSlide = (currentMobileSlide + 1) % mobileGalleryItems.length;
      mobileGalleryItems[currentMobileSlide].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }, 3000); // Auto-slide every 3 seconds
  }
}

function stopMobileGallerySlide() {
  if (mobileGalleryInterval) {
    clearInterval(mobileGalleryInterval);
    mobileGalleryInterval = null;
  }
}

// Initialize mobile gallery auto-slide
if (window.innerWidth <= 640) {
  startMobileGallerySlide();
}

// Pause auto-slide on hover/touch
if (mobileGallery) {
  mobileGallery.addEventListener('mouseenter', stopMobileGallerySlide);
  mobileGallery.addEventListener('mouseleave', () => {
    if (window.innerWidth <= 640) {
      startMobileGallerySlide();
    }
  });
  
  // Pause on touch start, resume on touch end
  mobileGallery.addEventListener('touchstart', stopMobileGallerySlide);
  mobileGallery.addEventListener('touchend', () => {
    if (window.innerWidth <= 640) {
      setTimeout(() => startMobileGallerySlide(), 2000); // Resume after 2 seconds
    }
  });
}

// Handle window resize
window.addEventListener('resize', () => {
  stopMobileGallerySlide();
  if (window.innerWidth <= 640) {
    startMobileGallerySlide();
  }
});
