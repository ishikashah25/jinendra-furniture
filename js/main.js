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

// Product modal logic
const modal = document.getElementById('product-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalClose = document.getElementById('modal-close');
const productCards = document.querySelectorAll('.product-card');
const modalBox = modal.querySelector('div.relative');

// Product images for each product (by title)
const productImagesMap = {
  'Modern Bed': [
    'assets/images/SofaCumBed.png',
    'assets/images/sofaCumBed2.png',
  ],
  'Classic Armchair': [
    'assets/images/RestChair.png',
  ],
  'Table': [
    'assets/images/Table1.png',
  ],
  'Wooden Bed': [
    'assets/images/Bed.png',
  ],
  'Dining Table': [
    'assets/images/diningTable.png',
  ],
  'Recliner': [
    'assets/images/recliner.png',
  ],
  'Cupboard': [
    'assets/images/cupboard.png',
  ],
  'Rest Chair': [
    'assets/images/chairs.png',
  ],
  'Sitting Chair': [
    'assets/images/sittings.png',
  ],
  'Sofa Set': [
    'assets/images/sofaSet1.png',
    'assets/images/sofaSet2.png',
  ],
  'Accent Chair': [
    'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80'
  ],
  'Sideboard': [
    'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80'
  ],
  'Work Desk': [
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=600&q=80'
  ]
};

const carouselImages = document.getElementById('carousel-images');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const carouselDots = document.getElementById('carousel-dots');
let currentCarouselIdx = 0;
let currentCarouselImgs = [];

function updateCarousel(idx) {
  if (!currentCarouselImgs.length) return;
  carouselImages.style.transform = `translateX(-${idx * 100}%)`;
  // Update dots
  Array.from(carouselDots.children).forEach((dot, i) => {
    dot.classList.toggle('bg-[#8d6e63]', i === idx);
    dot.classList.toggle('bg-[#d7ccc8]', i !== idx);
  });
  // Handle arrow visibility
  if (carouselPrev) {
    if (idx === 0) {
      carouselPrev.style.display = 'none';
    } else {
      carouselPrev.style.display = '';
    }
  }
  if (carouselNext) {
    if (idx === currentCarouselImgs.length - 1) {
      carouselNext.style.display = 'none';
    } else {
      carouselNext.style.display = '';
    }
  }
}

function openProductModal(title, desc) {
  currentCarouselImgs = productImagesMap[title] || [];
  let imgClass = "w-full h-56 sm:h-80 object-cover rounded-xl border-4 border-[#f8f5f2] shadow flex-shrink-0";
  if (title === 'Classic Armchair' || title === 'Rest Chair' || title === 'Recliner') {
    imgClass = "w-full h-56 sm:h-80 object-contain bg-[#f8f5f2] rounded-xl border-4 border-[#f8f5f2] shadow flex-shrink-0";
  } 
  if (title === 'Cupboard') {
    imgClass = "h-56 sm:h-80 object-top bg-[#f8f5f2] rounded-xl border-4 border-[#f8f5f2] shadow flex-shrink-0";
  }
  carouselImages.innerHTML = currentCarouselImgs.map(img => `<img src="${img}" class="${imgClass}" style="min-width:100%;max-width:100%">`).join('');
  carouselDots.innerHTML = currentCarouselImgs.map((_, i) => `<button class="w-3 h-3 rounded-full ${i === 0 ? 'bg-[#8d6e63]' : 'bg-[#d7ccc8]'}"></button>`).join('');
  currentCarouselIdx = 0;
  updateCarousel(currentCarouselIdx);
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modal.classList.add('modal-open');
  modal.classList.remove('hidden');
  setTimeout(() => {
    modalBox.classList.remove('scale-95', 'opacity-0');
    modalBox.classList.add('scale-100', 'opacity-100');
  }, 10);
  document.body.style.overflow = 'hidden';
}

productCards.forEach(card => {
  card.addEventListener('click', () => {
    openProductModal(card.getAttribute('data-title'), card.getAttribute('data-desc'));
  });
});

carouselPrev.addEventListener('click', () => {
  if (currentCarouselIdx > 0) {
    currentCarouselIdx--;
    updateCarousel(currentCarouselIdx);
  }
});
carouselNext.addEventListener('click', () => {
  if (currentCarouselIdx < currentCarouselImgs.length - 1) {
    currentCarouselIdx++;
    updateCarousel(currentCarouselIdx);
  }
});
carouselDots.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const idx = Array.from(carouselDots.children).indexOf(e.target);
    if (idx !== -1) {
      currentCarouselIdx = idx;
      updateCarousel(currentCarouselIdx);
    }
  }
});

// Swipe support for mobile
let startX = null;
carouselImages.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});
carouselImages.addEventListener('touchend', (e) => {
  if (startX === null) return;
  const endX = e.changedTouches[0].clientX;
  if (endX - startX > 40 && currentCarouselIdx > 0) {
    currentCarouselIdx--;
    updateCarousel(currentCarouselIdx);
  } else if (startX - endX > 40 && currentCarouselIdx < currentCarouselImgs.length - 1) {
    currentCarouselIdx++;
    updateCarousel(currentCarouselIdx);
  }
  startX = null;
});

function closeModal() {
  modalBox.classList.remove('scale-100', 'opacity-100');
  modalBox.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    modal.classList.remove('modal-open');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 200);
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
