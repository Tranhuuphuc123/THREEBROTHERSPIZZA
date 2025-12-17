'use client';

import { Form, Button, Card, Container } from 'react-bootstrap';
import styles from './page.module.css';
import Link from 'next/link';
import React, { useEffect, useState } from "react";

// Import useRouter chuyển hướng trang 
import { useRouter } from 'next/navigation'; 

//import axios call api auth login phân quyền
import {login} from "@/axios/axiosAuth"

//import useToast trong ToastContext(viết riêng chuẩn context ấy) 
import { useToast } from '@/contexts/ToastContext';


export default function AdminLogin() {
  /*state trang thai ghi nhận usernaem và password*/
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

   //khai báo state tu useToast trong ToastContext truyền vào bien state
    const {showToast} = useToast()

  // Khai báo state để lưu trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Khởi tạo router để chuyển hướng trang
  const router = useRouter(); 


  /**method xử lý sự kiện onSubmit khi nhấn button login**/
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //ngăn chặn hành vi mặc định của form(tải lại trang)
    e.preventDefault();

    //gọi api login từ axiosAuth.ts
    try {
      const token = await login(username, password);
      if (token) {
        // Sau khi login xong, token đã nằm trong localStorage (do hàm login làm)
        /*Chúng ta chuyển trang ngay lập tức goi là Chuyển hướng "Chủ động"
        -> nghĩa là Cái router.push trong hàm này chỉ chạy duy nhất một lần ngay 
        sau khi người dùng click nút Login và API trả về thành công.
        -> Mục đích: Đưa người dùng vào trong ngay lập tức sau khi họ thực 
        hiện hành động đăng nhập.*/
        router.push("/admin");

        //goi showToast vao de su dung hien thi TOast trong useEffect
        showToast("Login thành công", 'success')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Có lỗi khi Login!';
      showToast(errorMessage, 'danger')
    }
  }

  return (
    <div className={styles.bg}>
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className={`${styles.glass} p-4`} style={{ maxWidth: '400px', width: '100%' }}>
          <h3 className="text-center fw-bold mb-4 text-white">Login to Account</h3>

          <Form onSubmit = {handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Username</Form.Label>
              <Form.Control type="text" 
                            placeholder="Enter username"
                            //gán giá trị từ state vào input
                            value={username}
                            //ghi nhận value nhập từ input vao state
                            onChange={(e) => setUsername(e.target.value)} // Cần binding giá trị vào state
                            required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white">Password</Form.Label>
              <Form.Control type="password" 
                            placeholder="Enter password"
                             //gán giá trị từ state vào input
                            value={password}
                             //ghi nhận value nhập từ input vao state
                            onChange={(e) => setPassword(e.target.value)} // Cần binding giá trị vào state
                            required />
            </Form.Group>

            <Button  type="submit" className={`w-50 d-flex justify-content-center mx-auto mt-4 ${styles.btnGradient}`}>
              Log in
            </Button>

            <p className="text-center mt-3 text-white">
              Return to Homepage <Link href="/client" className={styles.link} >Homepage</Link>
            </p>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
