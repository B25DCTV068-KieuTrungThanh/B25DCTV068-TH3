# Sổ chi tiêu cá nhân

Ứng dụng React gồm hai phiên bản: **Phần A** dùng Class Component và **Phần B** dùng Function Component + Hooks. Chuyển phiên bản bằng nút A/B trên thanh đầu trang.

## Cấu trúc

```text
part-a-class/       Phần A: Class Component
part-b-hooks/       Phần B: Function Component, hooks, MockAPI
src/                Điểm khởi chạy, giao diện dùng chung và CSS
README.md           Tài liệu dự án
```

Các file `package.json`, `package-lock.json`, `index.html`, `.gitignore` và `.env.example` ở root phục vụ cài đặt, chạy và cấu hình project.

## Chạy ứng dụng

```bash
npm install
npm run dev
```

Build kiểm tra:

```bash
npm run build
```

Phần A có dữ liệu mẫu. Phần B lưu cục bộ bằng `localStorage` khi chưa cấu hình API. Để dùng MockAPI, sao chép `.env.example` thành `.env`, đặt `VITE_MOCKAPI_URL` bằng URL resource `expenses`, rồi khởi động lại Vite. Resource cần các trường `content`, `amount`, `category`, `date`.

## Hooks trong Phần B

- `useState` quản lý dữ liệu form, danh sách và bộ lọc mà không cần `this` hay constructor.
- `useEffect` xử lý đồng hồ, đồng bộ tiêu đề và debounce; cleanup timer khi component unmount.
- `useFetch` gom GET/POST/DELETE cùng trạng thái tải và lỗi; `useClock` tái sử dụng đồng hồ.
- `useRef` focus lại ô nội dung sau khi thêm; `useContext` chia sẻ chế độ sáng/tối.
