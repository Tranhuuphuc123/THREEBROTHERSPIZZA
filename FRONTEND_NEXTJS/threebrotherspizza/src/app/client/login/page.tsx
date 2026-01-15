"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

//import lib fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

//import xu ly an/hien passowrd qua icon con mắt ẩn/hiện(show/hidden password)
import PasswordInput from "@/components/client/passwordInput";

//import lib modal va cac lib lien quan xu ly modal context cho form login
import { useModal } from "@/contexts/ModalContext";
//import useToast trong ToastContext(viết riêng chuẩn context ấy) 
import { useToast } from '@/contexts/ToastContext';

//import lib chuyển hướng trang redirect
import { useRouter } from "next/navigation";

//import axios call api auth login phân quyền 
import { login } from "@/axios/axiosAuth"




export default function Login() {
  //khoi tao cac component cua modal context da khai bao o class modalcontext
  const { openModal, closeModal, show, modalType } = useModal();
  //khai báo state tu useToast trong ToastContext truyền vào bien state
  const { showToast } = useToast()
  const router = useRouter(); // Khởi tạo router

  /*state trang thai ghi nhận usernaem và password*/
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  /*Xử lý trạng thái "Đang đăng nhập" (Loading) Để tránh việc người 
  dùng nhấn nút Login liên tục khi API chưa kịp phản hồi, bạn nên thêm 
  một state isLoading. */
  const [isLoading, setIsLoading] = useState(false);


  /****method xử lý sự kiện onSubmit khi nhấn button login****/
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //ngăn chặn hành vi mặc định của form(tải lại trang)
    e.preventDefault();
    setIsLoading(true);
    try {
      /*1. gọi api login từ axiosAuth.ts*/
      const token = await login(username, password)

      //goi showToast vao de su dung hien thi TOast trong useEffect
      showToast("Login successfully", 'success')

      //closemodal khi submit nó đóng form login
      closeModal()

      /* 2. Chuyển hướng người dùng (Ví dụ về trang chủ hoặc admin)*/
      /* Tùy vào logic của bạn, có thể dùng router.push("/") 
      -> Làm mới dữ liệu để Interceptor nhận token mới nhất cho các request sau*/
      router.refresh();

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed!';
      showToast(errorMessage, 'danger');
    }
  }


  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100 mb-1">
        <div
          className="login-form-box bg-white p-1 p-md-5 rounded-3 shadow-sm w-100"
          style={{ maxWidth: "100%" }}
        >
          <div className="text-center mb-4">
            <FontAwesomeIcon
              icon={faGoogle}
              className="fa-3x"
              style={{ color: "#4285f4" }}
            />
            <h4 className="fw-bold mt-3 mb-1">Log in to your Account</h4>
            <div className="text-muted mb-2" style={{ fontSize: "1rem" }}>
              Welcome back, please enter your details.
            </div>
          </div>
          <button className="btn btn-light w-100 border d-flex align-items-center justify-content-center mb-3 google-btn">
            <FontAwesomeIcon icon={faGoogle} className="me-2" /> Continue with
            Google
          </button>
          <div className="d-flex align-items-center mb-3">
            <hr className="flex-grow-1" />
            <span className="mx-2 text-muted small">OR</span>
            <hr className="flex-grow-1" />
          </div>

          {/* form đk sự kiện */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Email Address
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="nhập username đăng nhập"
                value={username}
                required
                //kích hoạt sự kiện onchange ghi nhận value thay đổi khi nhập input
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">
                Password
              </label>

              {/* nut password : co icon con mat an hien password
               => lưu ý: để chuyền value và ghi nhận value thay đổi với onChange mà 
               PasswrodInput lại tách ra page riêng thì cần truyền props từ cha page 
               của login qua con là passwordInput */}
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                />
                <label className="form-check-label" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <a href="#" className="fw-bold small text-decoration-none">
                Forgot Password?
              </a>
            </div>

            {/* nút button login của form login */}
            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              style={{ fontWeight: 500 }}
              disabled={isLoading} // Ngăn nhấn nút khi đang load
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* mục không có tk để lk trang signup */}
          <div className="text-center small mt-2">
            Don&apos;t have an account?
            <Link
              href="/client/signup"
              className="fw-bold text-primary text-decoration-none"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
