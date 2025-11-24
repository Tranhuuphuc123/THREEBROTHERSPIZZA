/*file này giúp import lib bootstrap.min.js vào dự án 
 => nguyên nhân phải tạo file riêng thay vì import trực tiếp trong layout.tsx 
 như với bootstrap.min.css là do lỗi "window is not defined" khi build project
 => File layout.tsx là một Server Component theo mặc định trong Next.js App Router. 
 Code trong Server Component được thực thi trên máy chủ (Node.js) trong quá trình 
 render, và môi trường Node.js này không có đối tượng document (cái thuộc về trình duyệt).
 --> Bootstrap JS yêu cầu đối tượng document để khởi tạo các tính năng tương tác như 
 Dropdown, Modal, Toggle Sidebar, v.v. do đó phải tạo file riêng và call vào layout.tsx
 => */

 
 // File: src/app/components/BootstrapClient.tsx
 /*
 => Trong Next.js 13+ (App Router), mặc định mọi file React là Server Component, nghĩa là:
    + Chạy trên server.
    + Không có access tới browser API (window, document, localStorage,…).
    + Không dùng được các hook client như useState, useEffect, useRef.
    ==> Vậy 'use client' dùng để làm gì?
        ✔ Nó biến file đó thành Client Component, có nghĩa là:
        ✔ Được xài useState, useEffect, useRef
        ✔ Truy cập window, document, localStorage
        ✔ Chạy code phía browser
        ✔ Xử lý sự kiện người dùng (onClick, onChange, …)
    */
'use client'; // BẮT BUỘC

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Sử dụng require() hoặc dynamic import để tải JS trong trình duyệt
    require('bootstrap/dist/js/bootstrap.bundle.min.js'); 
  }, []);

  return null; 
}