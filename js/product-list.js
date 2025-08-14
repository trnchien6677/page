// Product List Page Logic
class ProductListManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentCategory = 'all';
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.setupEventListeners();
            this.renderProducts();
        } catch (error) {
            this.handleError(error);
        }
    }

    async loadProducts() {
        Utils.showLoading('loading');
        Utils.hideError('error');
        
        try {
            this.products = await ProductService.getAllProducts();
            this.filteredProducts = [...this.products];
            Utils.hideLoading('loading');
        } catch (error) {
            Utils.hideLoading('loading');
            throw error;
        }
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleCategoryFilter(e.target.dataset.category);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('product-card')) {
                e.target.click();
            }
        });
    }

    handleCategoryFilter(category) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Filter products
        this.currentCategory = category;
        this.filteredProducts = ProductService.filterProductsByCategory(this.products, category);
        
        // Re-render with animation
        this.renderProductsWithAnimation();

        // Save filter preference
        Utils.setLocalStorage('selectedCategory', category);
    }

    renderProducts() {
        const container = document.getElementById('products-grid');
        
        if (this.filteredProducts.length === 0) {
            this.renderEmptyState(container);
            return;
        }

        container.innerHTML = '';
        
        this.filteredProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
        });
    }

    renderProductsWithAnimation() {
        const container = document.getElementById('products-grid');
        const existingCards = container.querySelectorAll('.product-card');
        
        // Fade out existing cards
        existingCards.forEach(card => {
            card.classList.add('fade-out');
        });

        setTimeout(() => {
            this.renderProducts();
            
            // Fade in new cards
            const newCards = container.querySelectorAll('.product-card');
            newCards.forEach((card, index) => {
                card.classList.add('fade-out');
                setTimeout(() => {
                    card.classList.remove('fade-out');
                    card.classList.add('fade-in');
                }, index * 50);
            });
        }, 300);
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = `product-card ${!product.inStock ? 'out-of-stock' : ''}`;
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Xem chi tiết ${product.name}`);

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.thumbnail}" 
                     alt="${product.name}"
                     loading="lazy"
                     onerror="Utils.handleImageError(this)">
            </div>
            <div class="product-info">
                <div class="product-category">${Utils.formatCategory(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    ${Utils.formatPrice(product.price)}
                    <span class="currency">₫</span>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <a href="detail.html?id=${product.id}" class="view-details">
                        Xem chi tiết →
                    </a>
                    <span class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                        ${product.inStock ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                </div>
            </div>
        `;

        // Add click event
        card.addEventListener('click', () => {
            window.location.href = `detail.html?id=${product.id}`;
        });

        return card;
    }

    renderEmptyState(container) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="emoji">🔍</div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Không có sản phẩm nào trong danh mục này.</p>
                <button class="btn-primary" onclick="productListManager.handleCategoryFilter('all')">
                    Xem tất cả sản phẩm
                </button>
            </div>
        `;
    }

    handleError(error) {
        console.error('Lỗi tải danh sách sản phẩm:', error);
        Utils.hideLoading('loading');
        Utils.showError('error', 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        
        // Show retry button
        const errorElement = document.getElementById('error');
        if (errorElement && !errorElement.querySelector('.retry-btn')) {
            const retryButton = document.createElement('button');
            retryButton.className = 'btn-primary retry-btn';
            retryButton.textContent = 'Thử lại';
            retryButton.style.marginTop = '1rem';
            retryButton.onclick = () => {
                location.reload();
            };
            errorElement.appendChild(retryButton);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productListManager = new ProductListManager();
});
