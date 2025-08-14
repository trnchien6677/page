// Admin Panel Logic
class AdminManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
        this.editingProductId = null;
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.setupEventListeners();
            this.renderProductsTable();
            this.updateStats();
        } catch (error) {
            this.handleError(error);
        }
    }

    async loadProducts() {
        Utils.showLoading('loading');
        Utils.hideError('error');
        
        try {
            const data = await fetch('data.json').then(res => res.json());
            this.products = data.products || [];
            this.nextId = data.metadata?.nextId || (Math.max(...this.products.map(p => p.id), 0) + 1);
            Utils.hideLoading('loading');
        } catch (error) {
            Utils.hideLoading('loading');
            throw error;
        }
    }

    setupEventListeners() {
        // Form toggle
        document.getElementById('toggle-form').addEventListener('click', () => {
            this.toggleProductForm();
        });

        // Add product form
        document.getElementById('add-product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddProduct();
        });

        // Clear form
        document.getElementById('clear-form').addEventListener('click', () => {
            this.clearForm();
        });

        // Edit product form
        document.getElementById('edit-product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditProduct();
        });

        // Modal controls
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.closeEditModal();
        });

        // Delete modal controls
        document.getElementById('close-delete-modal').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('cancel-delete').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.confirmDelete();
        });

        // Refresh data
        document.getElementById('refresh-data').addEventListener('click', (e) => {
            e.preventDefault();
            this.refreshData();
        });

        // Click outside modal to close
        document.getElementById('edit-modal').addEventListener('click', (e) => {
            if (e.target.id === 'edit-modal') {
                this.closeEditModal();
            }
        });

        document.getElementById('delete-modal').addEventListener('click', (e) => {
            if (e.target.id === 'delete-modal') {
                this.closeDeleteModal();
            }
        });
    }

    toggleProductForm() {
        const form = document.getElementById('product-form');
        const toggleText = document.getElementById('form-toggle-text');
        
        if (form.style.display === 'none') {
            form.style.display = 'block';
            toggleText.textContent = 'Ẩn form';
        } else {
            form.style.display = 'none';
            toggleText.textContent = 'Hiện form';
        }
    }

    handleAddProduct() {
        const formData = new FormData(document.getElementById('add-product-form'));
        const product = this.createProductFromForm(formData);
        
        if (!this.validateProduct(product)) {
            return;
        }

        product.id = this.nextId++;
        product.createdAt = new Date().toISOString();
        product.updatedAt = new Date().toISOString();

        this.products.push(product);
        this.saveData();
        this.renderProductsTable();
        this.updateStats();
        this.clearForm();

        Toast.success(`Đã thêm sản phẩm "${product.name}" thành công!`);
    }

    handleEditProduct() {
        const formData = new FormData(document.getElementById('edit-product-form'));
        const updatedProduct = this.createProductFromForm(formData);
        
        if (!this.validateProduct(updatedProduct)) {
            return;
        }

        const index = this.products.findIndex(p => p.id === this.editingProductId);
        if (index !== -1) {
            updatedProduct.id = this.editingProductId;
            updatedProduct.createdAt = this.products[index].createdAt;
            updatedProduct.updatedAt = new Date().toISOString();
            
            this.products[index] = updatedProduct;
            this.saveData();
            this.renderProductsTable();
            this.closeEditModal();

            Toast.success(`Đã cập nhật sản phẩm "${updatedProduct.name}" thành công!`);
        }
    }

    createProductFromForm(formData) {
        const images = formData.get('images').split('\n')
            .map(img => img.trim())
            .filter(img => img.length > 0);

        return {
            name: formData.get('name').trim(),
            price: parseInt(formData.get('price')),
            category: formData.get('category'),
            description: formData.get('description').trim(),
            images: images,
            thumbnail: images[0] || 'images/products/placeholder.jpg',
            inStock: formData.get('inStock') === 'true'
        };
    }

    validateProduct(product) {
        if (!product.name || product.name.length < 3) {
            Toast.error('Tên sản phẩm phải có ít nhất 3 ký tự');
            return false;
        }

        if (!product.price || product.price < 0) {
            Toast.error('Giá sản phẩm phải lớn hơn 0');
            return false;
        }

        if (!product.category) {
            Toast.error('Vui lòng chọn danh mục sản phẩm');
            return false;
        }

        if (!product.description || product.description.length < 10) {
            Toast.error('Mô tả sản phẩm phải có ít nhất 10 ký tự');
            return false;
        }

        return true;
    }

    renderProductsTable() {
        const container = document.getElementById('products-table');
        
        if (this.products.length === 0) {
            container.innerHTML = `
                <div class="empty-products">
                    <div class="emoji">📦</div>
                    <h3>Chưa có sản phẩm nào</h3>
                    <p>Hãy thêm sản phẩm đầu tiên của bạn!</p>
                </div>
            `;
            return;
        }

        const table = document.createElement('table');
        table.className = 'table';
        
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Danh mục</th>
                    <th>Kho</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                ${this.products.map(product => this.createProductRow(product)).join('')}
            </tbody>
        `;

        container.innerHTML = '';
        container.appendChild(table);
    }

    createProductRow(product) {
        const createdDate = new Date(product.createdAt).toLocaleDateString('vi-VN');
        
        return `
            <tr>
                <td><strong>SP${product.id.toString().padStart(3, '0')}</strong></td>
                <td>
                    <img src="${product.thumbnail}" 
                         alt="${product.name}"
                         onerror="Utils.handleImageError(this)">
                </td>
                <td>
                    <div class="product-name" title="${product.name}">
                        ${product.name}
                    </div>
                </td>
                <td>
                    <div class="product-price">
                        ${Utils.formatPrice(product.price)}₫
                    </div>
                </td>
                <td>
                    <span class="product-category">
                        ${Utils.formatCategory(product.category)}
                    </span>
                </td>
                <td>
                    <span class="stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                        ${product.inStock ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                </td>
                <td>${createdDate}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon btn-view" 
                                onclick="adminManager.viewProduct(${product.id})"
                                title="Xem chi tiết">
                            👁️
                        </button>
                        <button class="btn-icon btn-edit" 
                                onclick="adminManager.editProduct(${product.id})"
                                title="Chỉnh sửa">
                            ✏️
                        </button>
                        <button class="btn-icon btn-delete" 
                                onclick="adminManager.deleteProduct(${product.id})"
                                title="Xóa">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    viewProduct(id) {
        window.open(`detail.html?id=${id}`, '_blank');
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            Toast.error('Không tìm thấy sản phẩm');
            return;
        }

        this.editingProductId = id;
        this.populateEditForm(product);
        this.showEditModal();
    }

    populateEditForm(product) {
        document.getElementById('edit-product-id').value = product.id;
        document.getElementById('edit-product-name').value = product.name;
        document.getElementById('edit-product-price').value = product.price;
        document.getElementById('edit-product-category').value = product.category;
        document.getElementById('edit-product-stock').value = product.inStock.toString();
        document.getElementById('edit-product-description').value = product.description;
        document.getElementById('edit-product-images').value = product.images.join('\n');
    }

    showEditModal() {
        document.getElementById('edit-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeEditModal() {
        document.getElementById('edit-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.editingProductId = null;
    }

    deleteProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            Toast.error('Không tìm thấy sản phẩm');
            return;
        }

        document.getElementById('delete-product-name').textContent = product.name;
        this.editingProductId = id;
        this.showDeleteModal();
    }

    showDeleteModal() {
        document.getElementById('delete-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeDeleteModal() {
        document.getElementById('delete-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.editingProductId = null;
    }

    confirmDelete() {
        const index = this.products.findIndex(p => p.id === this.editingProductId);
        if (index !== -1) {
            const productName = this.products[index].name;
            this.products.splice(index, 1);
            this.saveData();
            this.renderProductsTable();
            this.updateStats();
            this.closeDeleteModal();

            Toast.success(`Đã xóa sản phẩm "${productName}" thành công!`);
        }
    }

    clearForm() {
        document.getElementById('add-product-form').reset();
    }

    updateStats() {
        const count = this.products.length;
        document.getElementById('products-count').textContent = 
            `${count} sản phẩm${count !== 1 ? '' : ''}`;
    }

    saveData() {
        const data = {
            products: this.products,
            metadata: {
                lastUpdated: new Date().toISOString(),
                totalProducts: this.products.length,
                nextId: this.nextId
            }
        };

        // Simulate saving to data.json
        const jsonString = JSON.stringify(data, null, 2);
        
        // In a real local environment, you would need to implement file writing
        // For now, we'll show the JSON data that should be saved
        console.log('Data to save to data.json:', jsonString);
        
        // Save to localStorage as backup
        Utils.setLocalStorage('productsData', data);
        
        Toast.info('Dữ liệu đã được cập nhật. Hãy copy JSON từ console và lưu vào data.json');
    }

    async refreshData() {
        try {
            await this.loadProducts();
            this.renderProductsTable();
            this.updateStats();
            Toast.success('Đã làm mới dữ liệu thành công!');
        } catch (error) {
            Toast.error('Không thể làm mới dữ liệu');
            console.error(error);
        }
    }

    handleError(error) {
        console.error('Admin panel error:', error);
        Utils.hideLoading('loading');
        Utils.showError('error', 'Không thể tải dữ liệu admin panel');
        Toast.error('Đã xảy ra lỗi khi tải dữ liệu');
    }

    // Export/Import functionality
    exportData() {
        const data = {
            products: this.products,
            metadata: {
                exportedAt: new Date().toISOString(),
                totalProducts: this.products.length,
                nextId: this.nextId
            }
        };

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `products-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Toast.success('Đã xuất dữ liệu thành công!');
    }
}

// Initialize admin manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if running in local environment
    if (location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        window.adminManager = new AdminManager();
    } else {
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 2rem;">
                <div>
                    <h1>⚠️ Trang Admin</h1>
                    <p>Trang này chỉ hoạt động trong môi trường phát triển local.</p>
                    <p>Không thể truy cập từ GitHub Pages hoặc server production.</p>
                    <a href="index.html" style="color: #2563eb; text-decoration: none;">← Quay lại trang chủ</a>
                </div>
            </div>
        `;
    }
});
