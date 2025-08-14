// Product Detail Page Logic
class ProductDetailManager {
    constructor() {
        this.product = null;
        this.gallery = null;
        this.quantity = 1;
        this.productId = null;
        this.init();
    }

    async init() {
        // Lấy product ID từ URL
        this.productId = Utils.getUrlParameter('id');
        
        if (!this.productId) {
            this.showError('Không tìm thấy mã sản phẩm trong URL');
            return;
        }

        try {
            await this.loadProduct();
            this.setupEventListeners();
            this.renderProduct();
        } catch (error) {
            this.handleError(error);
        }
    }

    async loadProduct() {
        Utils.showLoading('loading');
        Utils.hideError('error');
        
        try {
            this.product = await ProductService.getProductById(this.productId);
            
            if (!this.product) {
                throw new Error('Sản phẩm không tồn tại');
            }
            
            Utils.hideLoading('loading');
        } catch (error) {
            Utils.hideLoading('loading');
            throw error;
        }
    }

    setupEventListeners() {
        // Quantity controls
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');
        const quantityInput = document.getElementById('quantity');

        if (qtyMinus) {
            qtyMinus.addEventListener('click', () => {
                this.decreaseQuantity();
            });
        }

        if (qtyPlus) {
            qtyPlus.addEventListener('click', () => {
                this.increaseQuantity();
            });
        }

        if (quantityInput) {
            quantityInput.addEventListener('change', (e) => {
                this.setQuantity(parseInt(e.target.value));
            });

            quantityInput.addEventListener('input', (e) => {
                this.setQuantity(parseInt(e.target.value));
            });
        }

        // Action buttons
        const addToCartBtn = document.getElementById('add-to-cart');
        const buyNowBtn = document.getElementById('buy-now');

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart();
            });
        }

        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                this.buyNow();
            });
        }
    }

    renderProduct() {
        if (!this.product) return;

        // Update page title
        document.title = `${this.product.name} - Cửa hàng sản phẩm`;

        // Update breadcrumb
        this.updateBreadcrumb();

        // Update product info
        this.updateProductInfo();

        // Setup gallery
        this.setupGallery();

        // Show product detail section
        const productDetail = document.getElementById('product-detail');
        if (productDetail) {
            productDetail.style.display = 'block';
        }
    }

    updateBreadcrumb() {
        const categoryElement = document.getElementById('product-category');
        const nameElement = document.getElementById('product-name-breadcrumb');

        if (categoryElement) {
            categoryElement.textContent = Utils.formatCategory(this.product.category);
        }

        if (nameElement) {
            nameElement.textContent = this.product.name;
        }
    }

    updateProductInfo() {
        // Product name
        const nameElement = document.getElementById('product-name');
        if (nameElement) {
            nameElement.textContent = this.product.name;
        }

        // Product price
        const priceElement = document.getElementById('product-price');
        if (priceElement) {
            priceElement.textContent = Utils.formatPrice(this.product.price);
        }

        // Stock status
        const stockElement = document.getElementById('stock-status');
        if (stockElement) {
            stockElement.className = `stock-status ${this.product.inStock ? 'in-stock' : 'out-of-stock'}`;
            stockElement.textContent = this.product.inStock ? '✅ Còn hàng' : '❌ Hết hàng';
        }

        // Product description
        const descElement = document.getElementById('product-description');
        if (descElement) {
            descElement.textContent = this.product.description;
        }

        // Product meta
        const idElement = document.getElementById('product-id');
        const categoryMetaElement = document.getElementById('product-category-meta');

        if (idElement) {
            idElement.textContent = `SP${this.product.id.toString().padStart(3, '0')}`;
        }

        if (categoryMetaElement) {
            categoryMetaElement.textContent = Utils.formatCategory(this.product.category);
        }

        // Update action buttons state
        this.updateActionButtons();
    }

    setupGallery() {
        if (!this.product.images || this.product.images.length === 0) {
            // Fallback to thumbnail if no images
            const images = this.product.thumbnail ? [this.product.thumbnail] : [];
            this.gallery = new ImageGallery(images);
            return;
        }

        this.gallery = new ImageGallery(this.product.images);
    }

    updateActionButtons() {
        const addToCartBtn = document.getElementById('add-to-cart');
        const buyNowBtn = document.getElementById('buy-now');

        if (!this.product.inStock) {
            if (addToCartBtn) {
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = '❌ Hết hàng';
                addToCartBtn.classList.add('btn-disabled');
            }

            if (buyNowBtn) {
                buyNowBtn.disabled = true;
                buyNowBtn.textContent = '❌ Hết hàng';
                buyNowBtn.classList.add('btn-disabled');
            }
        }
    }

    // Quantity management
    increaseQuantity() {
        if (this.quantity < 10) {
            this.setQuantity(this.quantity + 1);
        }
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.setQuantity(this.quantity - 1);
        }
    }

    setQuantity(newQuantity) {
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        } else if (newQuantity > 10) {
            newQuantity = 10;
        }

        this.quantity = newQuantity;

        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.value = this.quantity;
        }

        // Update button states
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');

        if (qtyMinus) {
            qtyMinus.disabled = this.quantity <= 1;
        }

        if (qtyPlus) {
            qtyPlus.disabled = this.quantity >= 10;
        }
    }

    // Actions
    addToCart() {
        if (!this.product.inStock) {
            Toast.error('Sản phẩm đã hết hàng');
            return;
        }

        // Simulate adding to cart
        const cartItem = {
            id: this.product.id,
            name: this.product.name,
            price: this.product.price,
            quantity: this.quantity,
            image: this.product.thumbnail,
            addedAt: new Date().toISOString()
        };

        // Save to localStorage (simple cart implementation)
        let cart = Utils.getLocalStorage('cart', []);
        
        // Check if item already exists
        const existingIndex = cart.findIndex(item => item.id === this.product.id);
        
        if (existingIndex !== -1) {
            cart[existingIndex].quantity += this.quantity;
        } else {
            cart.push(cartItem);
        }

        Utils.setLocalStorage('cart', cart);

        Toast.success(`Đã thêm ${this.quantity} ${this.product.name} vào giỏ hàng`);

        // Reset quantity
        this.setQuantity(1);
    }

    buyNow() {
        if (!this.product.inStock) {
            Toast.error('Sản phẩm đã hết hàng');
            return;
        }

        // Add to cart first
        this.addToCart();

        // Simulate redirect to checkout
        Toast.info('Đang chuyển đến trang thanh toán...');
        
        setTimeout(() => {
            // In a real app, this would redirect to checkout page
            alert(`Mua ngay ${this.quantity} ${this.product.name}\nTổng tiền: ${Utils.formatPrice(this.product.price * this.quantity)}₫`);
        }, 1000);
    }

    showError(message) {
        Utils.hideLoading('loading');
        Utils.showError('error', message);
        
        // Hide product detail
        const productDetail = document.getElementById('product-detail');
        if (productDetail) {
            productDetail.style.display = 'none';
        }
    }

    handleError(error) {
        console.error('Lỗi tải chi tiết sản phẩm:', error);
        
        if (error.message === 'Sản phẩm không tồn tại') {
            this.showError('Sản phẩm không tồn tại hoặc đã bị xóa');
        } else {
            this.showError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productDetailManager = new ProductDetailManager();
});
