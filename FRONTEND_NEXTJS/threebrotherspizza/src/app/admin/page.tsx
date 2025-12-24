/*'use client' là một chỉ thị (directive) dùng để đánh dấu Component này sẽ 
chạy ở Trình duyệt (Client) thay vì chạy ở Server.
 >>>>Tại sao phải dùng?<<<<<<<
    # Bạn bắt buộc phải ghi nó ở đầu file khi Component có sử dụng:
        + React Hooks: Như useState, useEffect, useContext.
        + Tương tác: Như onClick, onChange, onSubmit.
        + Browser API: Như window, document, localStorage.

    # Cơ chế hoạt động:
        + Mặc định: Next.js coi mọi Component là Server Component
         (không có tính tương tác, không có state).
        + Khi có 'use client': Next.js sẽ tải thêm mã JavaScript 
        xuống trình duyệt để người dùng có thể click, nhập liệu và
         xử lý các logic động. */
'use client'
import { useEffect, useState } from "react";


export default function Admin(){
    return(
        <>
         <h1>Homepage</h1>
        </>
    )
}




