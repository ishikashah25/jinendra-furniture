
    // Image Gallery Configuration
    const productGalleries = {
        'cozy-sofa-bed': [
          '../assets/images/SofaCumBed.png',
          '../assets/images/sofaCumBed2.png',
        ],
        'modern-fabric-bed': [
          '../assets/images/default.jpg'
        ]
      };
  
      let currentGallery = [];
      let currentIndex = 0;
      let touchStartX = 0;
      let touchEndX = 0;
      let isModalOpen = false;
  
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
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
  
        updateImage();
      }
  
      // Close viewer
      function closeViewer(fromPopState = false) {
        if (!isModalOpen) return;
  
        const modal = document.getElementById('imageViewerModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        isModalOpen = false;
  
        // Remove history state if not triggered by back button
        if (!fromPopState && history.state && history.state.modal === 'imageViewer') {
          history.back();
        }
      }
  
      // Update displayed image
      function updateImage() {
        const img = document.getElementById('viewerImage');
        const counter = document.getElementById('viewerCounter');
        const prevBtn = document.querySelector('.image-viewer-prev');
        const nextBtn = document.querySelector('.image-viewer-next');
  
        img.src = currentGallery[currentIndex];
        counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
  
        // Show/hide navigation buttons
        prevBtn.style.opacity = currentIndex > 0 ? '1' : '0';
        prevBtn.style.pointerEvents = currentIndex > 0 ? 'auto' : 'none';
        
        nextBtn.style.opacity = currentIndex < currentGallery.length - 1 ? '1' : '0';
        nextBtn.style.pointerEvents = currentIndex < currentGallery.length - 1 ? 'auto' : 'none';
      }
  
      // Navigation functions
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
  
      // Keyboard navigation
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
  
      // Handle browser back button
      window.addEventListener('popstate', function(e) {
        if (isModalOpen) {
          e.preventDefault();
          closeViewer(true);
        }
      });
  
      // Touch swipe handlers
      const imageContainer = document.getElementById('imageContainer');
      
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
  
      // Add click handlers to gallery divs
      document.querySelectorAll('[data-gallery]').forEach(element => {
        element.addEventListener('click', function(e) {
          const galleryId = this.getAttribute('data-gallery');
          openGallery(galleryId);
        });
      });