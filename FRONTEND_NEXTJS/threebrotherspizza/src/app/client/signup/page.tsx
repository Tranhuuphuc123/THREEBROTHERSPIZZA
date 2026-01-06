"use client";
import React from "react";

//sử dụng lib react hook form đơn giản quá trình thu thập value từ người dùng nhập vào 
import { useForm, SubmitHandler } from "react-hook-form"

//sử dụng icon của lib fontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

//import component xử lý ẩn hiện password của mục input password trong form login
import PasswordInput from "@/components/client/passwordInput_reacthookform";

//import types cho mục form SignUp
import {InputsTypes} from '@/types/SignUpTypes'

//import axiosClient
import axiosClient from "@/axios/axiosClient";
//import useToast trong ToastContext(viết riêng chuẩn context ấy) 
import { useToast } from '@/contexts/ToastContext';
//import useRouter chuyển hướng trang
import { useRouter } from "next/navigation";



/********************page SignUp.tsx************ */
const Signup = () => {
  //khai báo state tu useToast trong ToastContext truyền vào bien state
  const {showToast} = useToast()
  const router = useRouter(); // Khởi tạo router

  /* method xử lý handleSubmit theo mẫu lib react hook form */
   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputsTypes>()

  const onSubmit: SubmitHandler<InputsTypes> = async (data) => {
    try {
      const res = await axiosClient.post('/users/create', {
        username: data.username,
        password: data.password,
        email: data.email
      });

      // Kiểm tra status code của HTTP phản hồi (Axios mặc định trả về status ở cấp 1)
      if (res.status === 200 || res.status === 201) {
        showToast('Create account success! please comfirm with gmail', 'success');
        
        // Chuyển hướng sau một khoảng thời gian ngắn để user kịp nhìn thấy Toast
        setTimeout(() => {
          router.push('/client');
        }, 1500);
        
      } else {
        // Trường hợp Server trả về thành công nhưng logic bên trong báo lỗi
        showToast(res.data.message || 'Create account failed!', 'danger');
      }
    } catch (error: any) {
      // Lấy thông báo lỗi từ phía Server trả về nếu có
      const errorMsg = error.response?.data?.message || error.message || 'Something went wrong';
      showToast(`${errorMsg} !`, 'warning');
    }
  }

  return (
    <>
      <div className="container-fluid py-1" 
           style={{ minHeight: "100vh", marginBottom: "100px"  }}>
        <div
          className="signup-form-box bg-white p-4 p-md-5 rounded-3 shadow-sm w-100"
          style={{ maxWidth: "100%", margin: "0 auto" }}
        >
          <div className="text-center mb-4">
            <FontAwesomeIcon
              icon={faGoogle}
              style={{ height: "54px", color: "#ea4335" }}
            />
            <h3 className="fw-bold mt-3 mb-1">Create an Account</h3>
            <div className="text-muted mb-2" style={{ fontSize: "1rem" }}>
              Sign up now to get started with an account.
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-light w-20 border d-flex align-items-center justify-content-center mb-3 google-btn">
              <FontAwesomeIcon
                icon={faGoogle}
                style={{ height: "20px", width: "20px", marginRight: 8 }}
              />
              Sign up with Google
            </button>
          </div>
          <div className="d-flex align-items-center mb-3">
            <hr className="flex-grow-1" />
            <span className="mx-2 text-muted small">OR</span>
            <hr className="flex-grow-1" />
          </div>

          {/* form nhập signup */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* nhập username */}
            <div className="row mb-3 align-items-center">
              <label
                htmlFor="username"
                className="col-md-3 col-form-label text-md-end"
              >
                User Name<span className="text-danger">*</span>
              </label>
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter username"
                  required
                  /*kỹ thuật prefix của lib react hook form thay 
                   thế cho  onChange={(e) => setState(e.target.value)}
                   để thu nhập value nhập từ bàn phím */
                  {...register("username", { required: true })}
                />
              </div>
            </div>

            {/* nhập mật khẩu */}
            <div className="row mb-3 align-items-center position-relative">
              <label
                htmlFor="password"
                className="col-md-3 col-form-label text-md-end"
              >
                Password<span className="text-danger">*</span>
              </label>
              <div className="col-md-9 position-relative">
                {/* nut password : co icon con mat an hien password
                => lưu ý: để chuyền value và ghi nhận value thay đổi với {...register}
                kiểu cách thu nhập value của react hook form thay thế onchange thu nhập 
                value bằng usestate  thông thường khi mẫu input: PasswrodInput đc tách ra 
                page riêng thì cần truyền props từ cha page của Signup qua con là passwordInput
                 */}
                <PasswordInput  
                      /*kỹ thuật prefix của lib react hook form thay 
                      thế cho  onChange={(e) => setState(e.target.value)}
                      để thu nhập value nhập từ bàn phím */
                      register={register("password", { required: true })}/>
              </div>
            </div>

            {/* nhập lại mật khẩu */}
            <div className="row mb-3 align-items-center position-relative">
              <label
                htmlFor="confirmpassword"
                className="col-md-3 col-form-label text-md-end"
              >
                Confirm Password<span className="text-danger">*</span>
              </label>
              <div className="col-md-9 position-relative">
                {/* nut password : co icon con mat an hien password
                => lưu ý: để chuyền value và ghi nhận value thay đổi với {...register}
                kiểu cách thu nhập value của react hook form thay thế onchange thu nhập 
                value bằng usestate  thông thường khi mẫu input: PasswrodInput đc tách ra 
                page riêng thì cần truyền props từ cha page của Signup qua con là passwordInput
                 */}
                <PasswordInput  
                      /*kỹ thuật prefix của lib react hook form thay 
                      thế cho  onChange={(e) => setState(e.target.value)}
                      để thu nhập value nhập từ bàn phím */
                      register={register("confirm_password", { required: true })}/>
              </div>
            </div>

            {/* nhập email */}
             <div className="row mb-3 align-items-center">
              <label
                htmlFor="email"
                className="col-md-3 col-form-label text-md-end"
              >
                Email Address<span className="text-danger">*</span>
              </label>
              <div className="col-md-9">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="example@email.com"
                  required
                   /*kỹ thuật prefix của lib react hook form thay 
                    thế cho  onChange={(e) => setState(e.target.value)}
                    để thu nhập value nhập từ bàn phím */
                    {...register("email", { required: true })}
                />
              </div>
            </div>

            {/* <div className="row mb-3">
              <div className="offset-md-3 col-md-9">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="terms"
                    required
                  />
                  <label className="form-check-label small" htmlFor="terms">
                    I have read and agree to the
                    <a href="#" className="text-primary text-decoration-none">
                      Terms of Service
                    </a>
                  </label>
                </div>
              </div>
            </div> */}

            {/* button create account */}
            <div className="row mb-3">
              <div className="offset-md-3 col-md-9">
                <button
                  type="submit"
                  className="btn btn-primary w-30 mb-3"
                  style={{ fontWeight: 500 }}
                >
                  Create Account
                </button>
              </div>
            </div>
          </form>
          {/* end form signup */}

        </div>
      </div>
    </>
  );
};
export default Signup;
