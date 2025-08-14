# 📸 Hướng dẫn Hình ảnh - Image Requirements

## 📁 Cấu trúc thư mục ảnh đã tạo

```
images/
└── products/           ✅ ĐÃ TẠO
    ├── .gitkeep       ✅ File placeholder
    └── [ảnh sản phẩm]  ⚠️ CẦN THÊM
```

## 🎯 Danh sách ảnh cần thiết (theo data.json)

### Sản phẩm 1: Áo thun nam basic (ID: 1)
**Thumbnail:** `images/products/ao-thun-1.jpg`
**Gallery images:**
- `images/products/ao-thun-1.jpg` (ảnh chính)
- `images/products/ao-thun-2.jpg` (ảnh phụ 1)
- `images/products/ao-thun-3.jpg` (ảnh phụ 2)

**Kích thước khuyến nghị:**
- Thumbnail: 300x300px (vuông)
- Gallery: 800x800px (vuông, chất lượng cao)

---

### Sản phẩm 2: Giày sneaker trắng (ID: 2)
**Thumbnail:** `images/products/giay-1.jpg`
**Gallery images:**
- `images/products/giay-1.jpg` (ảnh chính)
- `images/products/giay-2.jpg` (góc nghiêng)
- `images/products/giay-3.jpg` (mặt sau)
- `images/products/giay-4.jpg` (đế giày)

**Kích thước khuyến nghị:**
- Thumbnail: 300x300px
- Gallery: 800x800px

---

### Sản phẩm 3: Túi xách nữ da PU (ID: 3)
**Thumbnail:** `images/products/tui-1.jpg`
**Gallery images:**
- `images/products/tui-1.jpg` (ảnh chính)
- `images/products/tui-2.jpg` (ảnh chi tiết)

**Kích thước khuyến nghị:**
- Thumbnail: 300x300px
- Gallery: 800x800px

---

## 🔍 Tìm ảnh ở đâu?

### 1. Ảnh miễn phí (Free Stock Photos)
- **Unsplash**: https://unsplash.com/
- **Pexels**: https://www.pexels.com/
- **Pixabay**: https://pixabay.com/

### 2. Từ khóa tìm kiếm
- "white t-shirt mockup"
- "white sneakers product photography"
- "leather handbag product shot"
- "fashion product photography"

### 3. Ảnh sản phẩm thật
- Chụp ảnh sản phẩm thật của bạn
- Sử dụng background trắng/sáng
- Ánh sáng đều, không bóng

---

## 📐 Quy chuẩn ảnh

### Thumbnail (Hiển thị trong grid)
- **Kích thước:** 300x300px (tỷ lệ 1:1)
- **Format:** JPG hoặc WebP
- **Dung lượng:** < 50KB
- **Background:** Trắng hoặc trong suốt

### Gallery Images (Slideshow chi tiết)
- **Kích thước:** 800x800px (tỷ lệ 1:1)
- **Format:** JPG hoặc WebP
- **Dung lượng:** < 200KB mỗi ảnh
- **Chất lượng:** Cao, rõ nét

### Responsive Images
- **Mobile:** 400x400px
- **Tablet:** 600x600px  
- **Desktop:** 800x800px

---

## 🛠️ Cách thêm ảnh

### Bước 1: Tải ảnh về
1. Tải ảnh từ nguồn miễn phí
2. Đổi tên theo format: `[tên-sản-phẩm]-[số].jpg`
3. Tối ưu kích thước và dung lượng

### Bước 2: Đặt vào thư mục
```
d:\mypage\images\products\
├── ao-thun-1.jpg
├── ao-thun-2.jpg
├── ao-thun-3.jpg
├── giay-1.jpg
├── giay-2.jpg
├── giay-3.jpg
├── giay-4.jpg
├── tui-1.jpg
└── tui-2.jpg
```

### Bước 3: Kiểm tra đường dẫn
Đảm bảo tên file trong `data.json` khớp với tên file thực tế.

---

## 🎨 Placeholder System (Đã có sẵn)

Nếu không có ảnh thật, hệ thống sẽ tự động tạo placeholder:

### Tự động tạo placeholder khi:
- File ảnh không tồn tại
- Đường dẫn ảnh bị lỗi
- Ảnh không load được

### Placeholder hiển thị:
- Background màu xám nhạt
- Icon camera ở giữa
- Text "No Image Available"
- Kích thước responsive

---

## 🚀 Quick Start (Không cần ảnh thật)

### Option 1: Sử dụng Placeholder
1. Không cần thêm ảnh gì
2. Mở `index.html` → Sẽ hiển thị placeholder
3. Hệ thống vẫn hoạt động bình thường

### Option 2: Ảnh mẫu nhanh
1. Tải 9 ảnh bất kỳ từ internet
2. Đổi tên theo danh sách trên
3. Đặt vào `images/products/`
4. Refresh trang → Ảnh hiển thị

---

## 🔧 Tối ưu ảnh (Advanced)

### Công cụ nén ảnh
- **TinyPNG**: https://tinypng.com/
- **ImageOptim**: https://imageoptim.com/
- **Squoosh**: https://squoosh.app/

### Format khuyến nghị
```css
/* Trong CSS đã support */
.product-image {
    background: url('image.webp'), url('image.jpg');
    /* WebP first, JPG fallback */
}
```

### Lazy Loading (Đã implement)
- Ảnh chỉ load khi cần thiết
- Cải thiện performance
- Placeholder hiển thị trước

---

## 📱 Test trên các thiết bị

### Desktop
- Hover effects trên product cards
- Gallery slideshow với keyboard navigation
- Zoom ảnh khi click

### Mobile  
- Touch swipe trong gallery
- Responsive image sizing
- Fast loading trên 3G

### Tablet
- Touch và mouse support
- Optimal image quality
- Smooth animations

---

## 🎯 Kết luận

**Thư mục `images/products/` đã được tạo!**

**Bạn có 2 lựa chọn:**

1. **🚀 Test ngay:** Mở `index.html` → Hệ thống hoạt động với placeholder
2. **📸 Thêm ảnh thật:** Theo hướng dẫn trên để có ảnh đẹp

**Hệ thống sẽ hoạt động hoàn hảo trong cả 2 trường hợp!** ✨
