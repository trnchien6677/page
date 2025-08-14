// Image Gallery/Slideshow Component
class ImageGallery {
    constructor(images, containerId) {
        this.images = images || [];
        this.containerId = containerId;
        this.currentIndex = 0;
        this.mainImageElement = null;
        this.thumbnailsContainer = null;
        this.prevButton = null;
        this.nextButton = null;
        
        if (this.images.length > 0) {
            this.init();
        }
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.updateDisplay();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
    }

    setupElements() {
        this.mainImageElement = document.getElementById('main-image');
        this.thumbnailsContainer = document.getElementById('thumbnails');
        this.prevButton = document.getElementById('prev-btn');
        this.nextButton = document.getElementById('next-btn');

        if (!this.mainImageElement || !this.thumbnailsContainer) {
            console.error('Gallery elements not found');
            return;
        }

        // Tạo thumbnails
        this.createThumbnails();
    }

    createThumbnails() {
        this.thumbnailsContainer.innerHTML = '';
        
        this.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `
                <img src="${image}" 
                     alt="Ảnh ${index + 1}"
                     onerror="Utils.handleImageError(this)">
            `;
            
            thumbnail.addEventListener('click', () => {
                this.goToSlide(index);
            });

            this.thumbnailsContainer.appendChild(thumbnail);
        });
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                this.previousSlide();
            });
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        // Main image error handling
        if (this.mainImageElement) {
            this.mainImageElement.addEventListener('error', (e) => {
                Utils.handleImageError(e.target);
            });

            // Image loading state
            this.mainImageElement.addEventListener('load', () => {
                this.mainImageElement.classList.remove('image-loading');
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Chỉ hoạt động khi đang ở trang chi tiết sản phẩm
            if (!document.getElementById('product-detail')) return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.images.length - 1);
                    break;
            }
        });
    }

    setupTouchNavigation() {
        if (!this.mainImageElement) return;

        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;

        this.mainImageElement.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.mainImageElement.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX, minSwipeDistance);
        }, { passive: true });
    }

    handleSwipe(startX, endX, minDistance) {
        const distance = startX - endX;
        
        if (Math.abs(distance) < minDistance) return;

        if (distance > 0) {
            // Swipe left - next image
            this.nextSlide();
        } else {
            // Swipe right - previous image
            this.previousSlide();
        }
    }

    nextSlide() {
        if (this.currentIndex < this.images.length - 1) {
            this.goToSlide(this.currentIndex + 1);
        } else {
            // Loop to first image
            this.goToSlide(0);
        }
    }

    previousSlide() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        } else {
            // Loop to last image
            this.goToSlide(this.images.length - 1);
        }
    }

    goToSlide(index) {
        if (index < 0 || index >= this.images.length) return;

        this.currentIndex = index;
        this.updateDisplay();
        this.updateThumbnails();
        this.updateNavigationButtons();
    }

    updateDisplay() {
        if (!this.mainImageElement || !this.images[this.currentIndex]) return;

        // Add loading state
        this.mainImageElement.classList.add('image-loading');
        
        // Update main image
        this.mainImageElement.src = this.images[this.currentIndex];
        this.mainImageElement.alt = `Ảnh sản phẩm ${this.currentIndex + 1}`;

        // Smooth transition effect
        this.mainImageElement.style.opacity = '0';
        setTimeout(() => {
            this.mainImageElement.style.opacity = '1';
        }, 100);
    }

    updateThumbnails() {
        const thumbnails = this.thumbnailsContainer.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === this.currentIndex);
        });

        // Scroll active thumbnail into view
        const activeThumbnail = thumbnails[this.currentIndex];
        if (activeThumbnail) {
            activeThumbnail.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    updateNavigationButtons() {
        if (this.images.length <= 1) {
            // Hide navigation if only one image
            if (this.prevButton) this.prevButton.style.display = 'none';
            if (this.nextButton) this.nextButton.style.display = 'none';
            return;
        }

        // Show navigation buttons
        if (this.prevButton) this.prevButton.style.display = 'flex';
        if (this.nextButton) this.nextButton.style.display = 'flex';

        // Update button states (optional - remove if you want infinite loop)
        // if (this.prevButton) {
        //     this.prevButton.disabled = this.currentIndex === 0;
        // }
        // if (this.nextButton) {
        //     this.nextButton.disabled = this.currentIndex === this.images.length - 1;
        // }
    }

    // Public methods
    addImage(imageSrc) {
        this.images.push(imageSrc);
        this.createThumbnails();
        this.updateNavigationButtons();
    }

    removeImage(index) {
        if (index < 0 || index >= this.images.length) return;

        this.images.splice(index, 1);
        
        if (this.currentIndex >= this.images.length) {
            this.currentIndex = Math.max(0, this.images.length - 1);
        }

        this.createThumbnails();
        this.updateDisplay();
        this.updateNavigationButtons();
    }

    getCurrentImage() {
        return this.images[this.currentIndex];
    }

    getCurrentIndex() {
        return this.currentIndex;
    }

    getTotalImages() {
        return this.images.length;
    }

    // Auto-play functionality (optional)
    startAutoPlay(interval = 5000) {
        this.stopAutoPlay(); // Clear any existing interval
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, interval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Cleanup
    destroy() {
        this.stopAutoPlay();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownHandler);
        
        // Clear references
        this.mainImageElement = null;
        this.thumbnailsContainer = null;
        this.prevButton = null;
        this.nextButton = null;
    }
}

// Export for global use
window.ImageGallery = ImageGallery;
