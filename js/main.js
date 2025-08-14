// Utility Functions và Service Classes
class ProductService {
    static async getAllProducts() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.products || [];
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
            throw error;
        }
    }

    static async getProductById(id) {
        try {
            const products = await this.getAllProducts();
            const product = products.find(p => p.id === parseInt(id));
            return product || null;
        } catch (error) {
            console.error('Lỗi khi tìm sản phẩm:', error);
            throw error;
        }
    }

    static filterProductsByCategory(products, category) {
        if (category === 'all') {
            return products;
        }
        return products.filter(product => product.category === category);
    }
}

// Utility Functions
const Utils = {
    // Format giá tiền
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price);
    },

    // Format danh mục
    formatCategory(category) {
        const categoryMap = {
            'clothing': 'Thời trang',
            'shoes': 'Giày dép',
            'accessories': 'Phụ kiện'
        };
        return categoryMap[category] || category;
    },

    // Lấy parameter từ URL
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show/Hide loading
    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'flex';
        }
    },

    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    },

    // Show/Hide error
    showError(elementId, message = '') {
        const element = document.getElementById(elementId);
        if (element) {
            if (message) {
                const messageElement = element.querySelector('p');
                if (messageElement) {
                    messageElement.textContent = message;
                }
            }
            element.style.display = 'block';
        }
    },

    hideError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    },

    // Tạo placeholder image khi ảnh bị lỗi
    createImagePlaceholder(width = 300, height = 200) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, width, height);
        
        // Icon
        ctx.fillStyle = '#9ca3af';
        ctx.font = `${Math.min(width, height) / 4}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📷', width / 2, height / 2);
        
        return canvas.toDataURL();
    },

    // Handle image error
    handleImageError(imgElement) {
        imgElement.src = this.createImagePlaceholder();
        imgElement.alt = 'Ảnh không tải được';
        imgElement.classList.add('image-error');
    },

    // Smooth scroll to element
    scrollToElement(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Local Storage helpers
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Lỗi khi lưu vào localStorage:', error);
        }
    },

    getLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Lỗi khi đọc từ localStorage:', error);
            return defaultValue;
        }
    },

    // Animation helpers
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    },

    fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = initialOpacity * (1 - Math.min(progress / duration, 1));
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        requestAnimationFrame(animate);
    }
};

// Toast notification system
class Toast {
    static show(message, type = 'info', duration = 3000) {
        // Tạo container nếu chưa có
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }

        // Tạo toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Set màu sắc theo type
        const colors = {
            success: '#059669',
            error: '#dc2626',
            warning: '#d97706',
            info: '#2563eb'
        };
        toast.style.backgroundColor = colors[type] || colors.info;
        toast.textContent = message;

        container.appendChild(toast);

        // Animation slide in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    static success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    static error(message, duration = 4000) {
        this.show(message, 'error', duration);
    }

    static warning(message, duration = 3500) {
        this.show(message, 'warning', duration);
    }

    static info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    Toast.error('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    Toast.error('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
});

// Export cho sử dụng global
window.ProductService = ProductService;
window.Utils = Utils;
window.Toast = Toast;
