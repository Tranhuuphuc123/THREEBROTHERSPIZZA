/* xu ly nghiep vu an hien password khi b am vao icon con mat
 */
"use client";

import { useReducer, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

//import types định kiểu dữ liệu cho PasswordInput
import { PasswordInputTypes } from "@/types/PassWordInputTypes";

export default function PasswordInput({register}: any) {
  const [showPassword, setShowPassword] = useState(false);

  /*
     + useRef: tao mot tham chiu den phan tu input de thao tac voi no
     + HTMLInputElement: kieu du lieu cua phan tu input trong ts
     + null: gia tri ban dau cua tham chieu
    */
  const inputRef = useRef<HTMLInputElement>(null);

  /* tao function xu ly viec mo /tat con mat an hien mat khau */
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
    if (inputRef.current) {
      inputRef.current.type = showPassword ? "text" : "password";
    }
  };

  return (
    <>
      {/* //relative: làm cho phần tử cha làm mốc để đặt vị trí của phần tử con */}
      <div className="relative">
        <input
          // sử dụng register để react hook form lk đc với form passwordInput này
          {...register}
          ref={(e) => {
              inputRef.current = e; // gán giá trị của inputRef
              register.ref(e) //kết nối với react hook form
            }
          }
          type={showPassword ? "text" : "password"}
          id="password"
          className="form-control"
          placeholder="Nhập mật khẩu"
          required
        />
        <span onClick={togglePassword} className="toggle-password">
          {showPassword == true && (
            <FontAwesomeIcon icon={faEyeSlash} className="me-2" />
          )}
          {!showPassword == true && (
            <FontAwesomeIcon icon={faEye} className="me-2" />
          )}
        </span>
      </div>
    </>
  );
}
