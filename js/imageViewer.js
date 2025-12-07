const productGalleries = {
  'cozy-sofa-bed': [
    '../assets/images/SofaCumBed.png',
    '../assets/images/sofaCumBed1-2.png',
  ],
  'modern-fabric-bed': [
    '../assets/images/sofacumBed2.jpeg'
  ]
};

let currentGallery = [];
let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let isModalOpen = false;

function preloadImages(imageArray) {
  return Promise.all(
    imageArray.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    })
  );
}

// Open gallery
function openGallery(galleryId) {
  currentGallery = productGalleries[galleryId] || [];
  
  if (currentGallery.length === 0) {
    console.error('No images found for gallery:', galleryId);
    return;
  }

  currentIndex = 0;
  isModalOpen = true;

  // Push state for back button handling
  history.pushState({ modal: 'imageViewer' }, '');

  const modal = document.getElementById('imageViewerModal');
  const img = document.getElementById('viewerImage');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  img.style.opacity = '0';
  img.src = currentGallery[currentIndex];

  img.onload = function() {
    img.style.opacity = '1';
    updateNavigationButtons();
    updateCounter();
  };

  if (currentGallery.length > 1) {
    preloadImages(currentGallery.slice(1)).catch(err => {
      console.warn('Some images failed to preload:', err);
    });
  }
}

function closeViewer(fromPopState = false) {
  if (!isModalOpen) return;

  const modal = document.getElementById('imageViewerModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  isModalOpen = false;

  if (!fromPopState && history.state && history.state.modal === 'imageViewer') {
    history.back();
  }
}

function updateCounter() {
  const counter = document.getElementById('viewerCounter');
  counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
}

function updateNavigationButtons() {
  const prevBtn = document.querySelector('.image-viewer-prev');
  const nextBtn = document.querySelector('.image-viewer-next');

  prevBtn.style.opacity = currentIndex > 0 ? '1' : '0.3';
  prevBtn.style.pointerEvents = currentIndex > 0 ? 'auto' : 'none';
  
  nextBtn.style.opacity = currentIndex < currentGallery.length - 1 ? '1' : '0.3';
  nextBtn.style.pointerEvents = currentIndex < currentGallery.length - 1 ? 'auto' : 'none';
}

function updateImage() {
  const img = document.getElementById('viewerImage');

  img.style.opacity = '0';

  setTimeout(() => {
    img.src = currentGallery[currentIndex];
    
    // Fade in once loaded
    img.onload = function() {
      img.style.opacity = '1';
      updateCounter();
      updateNavigationButtons();
    };
  }, 150);
}

function showNextImage() {
  if (currentIndex < currentGallery.length - 1) {
    currentIndex++;
    updateImage();
  }
}

function showPreviousImage() {
  if (currentIndex > 0) {
    currentIndex--;
    updateImage();
  }
}

document.addEventListener('keydown', function(e) {
  if (!isModalOpen) return;

  switch(e.key) {
    case 'Escape':
      closeViewer();
      break;
    case 'ArrowLeft':
      showPreviousImage();
      break;
    case 'ArrowRight':
      showNextImage();
      break;
  }
});

window.addEventListener('popstate', function(e) {
  if (isModalOpen) {
    e.preventDefault();
    closeViewer(true);
  }
});

const imageContainer = document.getElementById('imageContainer');

if (imageContainer) {
  imageContainer.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  imageContainer.addEventListener('touchmove', function(e) {
    touchEndX = e.changedTouches[0].screenX;
  }, { passive: true });

  imageContainer.addEventListener('touchend', function() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        showNextImage();
      } else {
        showPreviousImage();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-gallery]').forEach(element => {
    element.addEventListener('click', function(e) {
      e.preventDefault();
      const galleryId = this.getAttribute('data-gallery');
      openGallery(galleryId);
    });
  });
});