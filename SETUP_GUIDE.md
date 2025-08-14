# 🚀 Hướng dẫn Setup và Sử dụng

## 📋 Tổng quan dự án

Dự án **Product Management & Display System** đã được implement đầy đủ với các tính năng:

✅ **Trang chủ** (`index.html`) - Hiển thị danh sách sản phẩm với filter  
✅ **Trang chi tiết** (`detail.html`) - Chi tiết sản phẩm với gallery slideshow  
✅ **Trang admin** (`admin.html`) - Quản lý CRUD sản phẩm (local only)  
✅ **Responsive design** - Tương thích mobile, tablet, desktop  
✅ **JSON data storage** - Lưu trữ dữ liệu không cần database  

## 📁 Cấu trúc dự án hoàn chỉnh

```
mypage/
├── index.html              ✅ Trang chủ (PUBLIC)
├── detail.html             ✅ Trang chi tiết (PUBLIC)
├── admin.html              ✅ Trang admin (LOCAL ONLY)
├── data.json               ✅ Dữ liệu sản phẩm (PUBLIC)
├── .gitignore              ✅ Loại trừ file admin
├── README.md               ✅ Tài liệu dự án
├── TECHNICAL_ARCHITECTURE.md ✅ Kiến trúc kỹ thuật
├── SETUP_GUIDE.md          ✅ Hướng dẫn này
├── styles/
│   ├── main.css            ✅ CSS chính
│   ├── product-grid.css    ✅ CSS grid sản phẩm
│   ├── product-detail.css  ✅ CSS chi tiết sản phẩm
│   └── admin.css           ✅ CSS admin (LOCAL ONLY)
├── js/
│   ├── main.js             ✅ Utilities chính
│   ├── product-list.js     ✅ Logic danh sách sản phẩm
│   ├── product-detail.js   ✅ Logic chi tiết sản phẩm
│   ├── gallery.js          ✅ Image slideshow
│   └── admin.js            ✅ Logic admin (LOCAL ONLY)
└── images/
    └── products/           ⚠️ CẦN TẠO - Thư mục ảnh sản phẩm
```

## 🛠️ Các bước setup

### Bước 1: Tạo thư mục ảnh
```bash
mkdir images
mkdir images/products
```

### Bước 2: Thêm ảnh sản phẩm mẫu
Đặt các file ảnh vào thư mục `images/products/`:
- `ao-thun-1.jpg`, `ao-thun-2.jpg`, `ao-thun-3.jpg`
- `giay-1.jpg`, `giay-2.jpg`, `giay-3.jpg`, `giay-4.jpg`
- `tui-1.jpg`, `tui-2.jpg`

**Hoặc** sử dụng ảnh placeholder tự động được tạo khi ảnh bị lỗi.

### Bước 3: Test local
1. Sử dụng Live Server hoặc local server
2. Mở `http://localhost:5500/index.html`
3. Test các tính năng:
   - ✅ Danh sách sản phẩm
   - ✅ Filter theo danh mục
   - ✅ Chi tiết sản phẩm với gallery
   - ✅ Admin panel tại `admin.html`

### Bước 4: Deploy lên GitHub Pages
1. Tạo repository trên GitHub
2. Push code (admin files sẽ bị loại trừ bởi `.gitignore`)
3. Enable GitHub Pages trong Settings
4. Truy cập: `https://username.github.io/repository-name`

## 🎯 Tính năng chính

### 🏠 Trang chủ (index.html)
- **Grid responsive** hiển thị sản phẩm
- **Filter theo danh mục**: Tất cả, Thời trang, Giày dép, Phụ kiện
- **Loading states** và error handling
- **Click vào sản phẩm** → chuyển đến trang chi tiết

### 📱 Trang chi tiết (detail.html)
- **URL routing**: `detail.html?id=1`
- **Image gallery** với slideshow
- **Navigation**: Keyboard (←→), Touch swipe, Click thumbnails
- **Quantity selector** và Add to cart simulation
- **Breadcrumb navigation**

### 🔧 Trang admin (admin.html) - LOCAL ONLY
- **CRUD operations**: Create, Read, Update, Delete
- **Form validation** đầy đủ
- **Modal dialogs** cho edit/delete
- **Table view** với sorting
- **JSON export** functionality

## 🎨 Responsive Design

### 📱 Mobile (320px - 768px)
- Single column layout
- Touch-friendly buttons
- Optimized image sizes
- Collapsible navigation

### 💻 Tablet (768px - 1024px)
- 2-column product grid
- Adjusted spacing
- Touch and mouse support

### 🖥️ Desktop (1024px+)
- Multi-column grid
- Hover effects
- Keyboard navigation
- Sticky gallery

## 🔧 Customization

### Thêm sản phẩm mới
1. Mở `admin.html` trong local server
2. Click "Hiện form" → Điền thông tin
3. Submit → Copy JSON từ console
4. Paste vào `data.json`
5. Deploy lên GitHub Pages

### Thay đổi màu sắc
Chỉnh sửa CSS variables trong `styles/main.css`:
```css
:root {
    --primary-color: #2563eb;    /* Màu chính */
    --success-color: #059669;    /* Màu thành công */
    --danger-color: #dc2626;     /* Màu nguy hiểm */
}
```

### Thêm danh mục mới
1. Cập nhật `Utils.formatCategory()` trong `js/main.js`
2. Thêm filter button trong `index.html`
3. Cập nhật dropdown trong `admin.html`

## 🚀 Performance Tips

### Tối ưu ảnh
- Sử dụng WebP format với JPEG fallback
- Compress ảnh trước khi upload
- Lazy loading đã được implement

### Tối ưu JSON
- Giữ file `data.json` < 1MB
- Số lượng sản phẩm tối ưu: 50-200 items
- Backup dữ liệu thường xuyên

## 🔒 Security & Best Practices

### GitHub Pages Deployment
- ✅ HTTPS tự động
- ✅ Admin files bị loại trừ
- ✅ No server-side vulnerabilities
- ✅ Static site security

### Local Development
- ✅ Admin panel chỉ hoạt động local
- ✅ Input validation đầy đủ
- ✅ Error handling robust
- ✅ XSS protection

## 🐛 Troubleshooting

### Ảnh không hiển thị
- Kiểm tra đường dẫn trong `data.json`
- Đảm bảo ảnh có trong thư mục `images/products/`
- Placeholder sẽ tự động hiển thị nếu ảnh lỗi

### Admin panel không hoạt động
- Chỉ hoạt động với `file://` hoặc `localhost`
- Không thể truy cập từ GitHub Pages
- Sử dụng Live Server để test

### JSON không update
- Copy JSON từ browser console
- Paste thủ công vào `data.json`
- Commit và push lên GitHub

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. **Browser Console** - Xem lỗi JavaScript
2. **Network tab** - Kiểm tra request failed
3. **File paths** - Đảm bảo đường dẫn chính xác
4. **Local server** - Sử dụng Live Server thay vì mở file trực tiếp

---

**🎉 Chúc mừng! Dự án của bạn đã sẵn sàng hoạt động!**
