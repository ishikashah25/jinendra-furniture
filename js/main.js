let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const totalSlides = slides.length;

    let slideInterval;

    // Enhanced Work Slider with Infinite Loop
    const workSlider = document.getElementById("work-slider");
    if (workSlider) {
      let isScrolling = false;
      
      // Clone items for infinite effect on mobile
      function setupInfiniteScroll() {
        if (window.innerWidth <= 640) { // Mobile only
          const items = workSlider.querySelectorAll('.product-card');
          
          // Clone first few items and append to end
          items.forEach((item, index) => {
            if (index < 3) { // Clone first 3 items
              const clone = item.cloneNode(true);
              clone.classList.add('cloned-item');
              workSlider.appendChild(clone);
            }
          });
        }
      }
      
      // Auto-scroll function with infinite loop
      function autoScrollWork() {
        if (isScrolling || window.innerWidth > 640) return; // Skip on desktop
        
        const scrollAmount = workSlider.clientWidth * 0.75; // 75vw width
        const maxScroll = workSlider.scrollWidth - workSlider.clientWidth;
        
        if (workSlider.scrollLeft >= maxScroll - 10) {
          // Reset to beginning smoothly
          workSlider.scrollTo({ left: 0, behavior: 'auto' });
          setTimeout(() => {
            workSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }, 50);
        } else {
          workSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
      
      // Setup infinite scroll on load and resize
      setupInfiniteScroll();
      window.addEventListener('resize', () => {
        // Remove cloned items
        document.querySelectorAll('.cloned-item').forEach(item => item.remove());
        setupInfiniteScroll();
      });
      
      // Auto-slide interval
      let autoSlide = setInterval(autoScrollWork, 3000);
      
      // Pause auto-slide when user interacts
      workSlider.addEventListener("touchstart", () => {
        isScrolling = true;
        clearInterval(autoSlide);
      });
      
      workSlider.addEventListener("touchend", () => {
        setTimeout(() => {
          isScrolling = false;
          autoSlide = setInterval(autoScrollWork, 3000);
        }, 1000);
      });
      
      workSlider.addEventListener("mousedown", () => {
        isScrolling = true;
        clearInterval(autoSlide);
      });
      
      workSlider.addEventListener("mouseup", () => {
        setTimeout(() => {
          isScrolling = false;
          autoSlide = setInterval(autoScrollWork, 3000);
        }, 1000);
      });
    }
    
    // animate sliderLogo -> navbarLogo using a cloned fixed element (prevents clipping)
    function animateLogoToNavbar() {
      const slider = document.getElementById("sliderLogo");
      const navbar = document.getElementById("navbarLogo");
      if (!slider || !navbar) return;
    
      const sRect = slider.getBoundingClientRect();
      const nRect = navbar.getBoundingClientRect();
      if (sRect.width === 0 || nRect.width === 0) {
        navbar.style.opacity = 1;
        return;
      }
    
      slider.style.opacity = "0";
    
      const clone = slider.cloneNode(true);
      clone.id = "sliderLogoClone";
      clone.style.position = "fixed";
      clone.style.left = `${sRect.left}px`;
      clone.style.top = `${sRect.top}px`;
      clone.style.width = `${sRect.width}px`;
      clone.style.height = `${sRect.height}px`;
      clone.style.margin = "0";
      clone.style.pointerEvents = "none";
      clone.style.zIndex = "9999";
      clone.style.opacity = "1";
      document.body.appendChild(clone);
    
      // Original centers
      const sCenterX = sRect.left + sRect.width / 2 + sRect.width / 4;
      const sCenterY = sRect.top + sRect.height / 2;
    
      // Target point slightly to the left of navbar logo
      const nTargetX = nRect.left;
      const nTargetY = nRect.top + nRect.height / 2 - 8;
    
      const deltaX = nTargetX - sCenterX;
      const deltaY = nTargetY - sCenterY;
    
      // Target scale
      let targetScale = nRect.width / sRect.width;
      if (window.innerWidth <= 768) {
        targetScale = 0.3;
      }
    
      // Timeline animation
      const tl = gsap.timeline();
      tl.to(clone, {
        x: deltaX,
        y: deltaY,
        scale: targetScale,
        duration: 1.2,
        ease: "power2.inOut"
      });
      tl.to(clone, { opacity: 0, duration: 0.25 }, "-=0.2");
      tl.to(navbar, { opacity: 1, scale: 1.05, duration: 0.25 }, "-=0.15");
      tl.to(navbar, { scale: 1, duration: 0.25, ease: "back.out(1.3)" });
    
      tl.call(() => {
        clone.remove();
      });
    }        
    
    window.addEventListener("load", () => {
      animateLogoToNavbar();
      startSlideInterval();
      updateActiveLink();
    });    
    
    function startSlideInterval() {
      slideInterval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    function stopSlideInterval() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }
    
    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[index].classList.add('active');
      dots[index].classList.add('active');
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }
    
    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    }
    
    // Event listeners for navigation
    document.getElementById('hero-next').addEventListener('click', () => {
      stopSlideInterval();
      nextSlide();
      startSlideInterval();
    });
    
    document.getElementById('hero-prev').addEventListener('click', () => {
      stopSlideInterval();
      prevSlide();
      startSlideInterval();
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopSlideInterval();
        currentSlide = index;
        showSlide(currentSlide);
        startSlideInterval();
      });
    });
    
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('show');
    });
    
    document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('show');
    });
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove('show');
    }
  }); 
    // Navigation active link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
      const currentSection = getCurrentSection();
      navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active-link');
        }
      });
    }
    
    function getCurrentSection() {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= scrollPos) {
          return section.getAttribute('id');
        }
      }
      return 'home';
    }
    
    // Initialize
    window.addEventListener('load', () => {
      startSlideInterval();
      updateActiveLink();
    });
    
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', () => {
      stopSlideInterval();
      startSlideInterval();
    });
    const heroSection = document.getElementById('home');
    heroSection.addEventListener('mouseenter', stopSlideInterval);
    heroSection.addEventListener('mouseleave', startSlideInterval);