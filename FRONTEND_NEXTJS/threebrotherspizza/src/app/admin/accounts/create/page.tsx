/******trang thiết kế nội dung create của products pages******/
'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';

//import interface  types định kiểu dữ liệu cho dữ liệu cho page props createProduct.
import {CreateAccountPropsTypes, AccountTypes} from "@/types/AccountTypes";

//import useToast trong ToastContext(viết riêng chuẩn context ấy) để sử dụng cho trang create products
import { useToast } from '@/contexts/ToastContext';
//khai bao import ModalContext mau context chung vao: luu ý import cai useModal hook ở qt3 
import {useModal} from "@/contexts/ModalContext"

//import lib fontAwesome cho NextJs
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSave} from '@fortawesome/free-solid-svg-icons'

//import lib axios xử lý call api co mục select category và supplier id
import axiosAdmin from '@/axios/axiosAdmin';

//React.FC<CreateProductPropsTypes>: đinh kiểu dữ liệu ts cho props truyền vào component createProduct
const CreateModal: React.FC<CreateAccountPropsTypes> = ({onReload}) => {

    //khai bao bien trang thai state - state dùng cho input nhập liệu từ client
    const [listSalaryLevel, setListSalaryLevel] = useState<any[]>([]);// Danh sách bậc lương

    // States cho Account
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [gender, setGender] = useState<number>(1); // 1: Nam, 0: Nữ
    const [birthday, setBirthday] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [levelId, setLevelId] = useState<number | null>(null);
    const [isActive, setIsActive] = useState<number>(1);

    // ### thêm state trường này báo lỗi chi tiết từng input bắt lỗi validation cho từng field###
    const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  
    //khai báo state tu useToast trong ToastContext truyền vào bien state
    const {showToast} = useToast()
    //state trang thai dung voi useModal cua ModalContext:
    const {closeModal} = useModal()

    /***method: xử lý sự kiện khi choosefile img thì ảnh hiện lên để có thể xem trc đc ảnh vừa chọn**/
    const [imagePreview, setImagePreview] = useState<string | null>(null); // state lưu img xem trước khi create sản phẩm
    const[file, setFile] = useState<File | null>(null); // state lưu file img  khi create sản phẩm

    /**method: xử lý xem trc img trc khi create **/
    const handleImgPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        //đọc nd tập tin cần hiển thị
        const file = e.target.files?.[0]
        if(file){
        //tạo Url láy địa chứa img xem trước
        const preView = URL.createObjectURL(file)
        //update url vào setImaePreview để cập nhặt
        setImagePreview(preView) 

        //lưu file ghi nhận img vào create sản phẩm
        setFile(file)
        }
    }


     /**********start - nhớm xử lý lỗi đổ ra input validation tận nơi**************** */
     // ###Hàm clear lỗi khi user nhập lại: xóa lỗi khi user nhập lại á####
     const clearFieldError = (fieldName: string) => {
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    // ###Hàm set lỗi cho field cụ thể###
    const setFieldError = (fieldName: string, message: string) => {
        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: message
        }));
    };
    /**********end - nhớm xử lý lỗi đổ ra input validation tận nơi**************** */


  /***hàm xử lý sự kiện submit nut save khi nhán lưu file: create product*****/
  //e: React.FormEvent<HTMLFormElement>: định kiểu dữ liệu ts cho event submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //ngăn chăn hành vi reload mặc định của form khi submi

    // ##Clear tất cả lỗi cũ trước khi submit###
    setFieldErrors({});
    
    try {
        const formData = new FormData();
        // 'file' này khớp với @RequestParam("file") bên Spring Boot
        if (file) {
            formData.append('file', file);
        }

        // Tạo object Account khớp với interface AccountTypes
        // Tinh chỉnh object trước khi gửi
            const newAccount = {
                name: name.trim(),
                username: username.trim(),
                password: password,
                gender: Number(gender),
                // Xử lý ngày sinh: Nếu chuỗi rỗng thì để null
                birthday: birthday === "" ? null : birthday, 
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim(),
                levelId: levelId ? Number(levelId) : null,
                isActive: Number(isActive)
            };

            // Kiểm tra validate cơ bản trước khi gọi API
            if (!newAccount.levelId) {
                showToast("PLeaser select salary Level!", 'warning');
                return;
            }

        // Gửi data dưới dạng JSON string (khớp với @RequestPart("data"))
        formData.append('data', JSON.stringify(newAccount));

        const response = await axiosAdmin.post("/users/create", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        showToast(response.data.msg || "Create account success!", 'success');
        if (onReload) onReload();
        closeModal();
        
    } catch (error: any) {
        /*********### start -Logic xử lý lỗi và bắt lỗi ném ra lỗi tt trên giao diện form input ###********* */
        // LẤY violations TỪ CẢ 2 TRƯỜNG HỢP: NẰM Ở ROOT HOẶC NẰM TRONG data
        const rawData = error.response?.data;
        const violations =
            rawData?.violations ||              // trường hợp backend trả thẳng violations ở root
            rawData?.data?.violations || [];    // trường hợp backend bọc trong "data"

        if (Array.isArray(violations) && violations.length > 0) {
            // Nếu có lỗi validation chi tiết từ server
            violations.forEach((violation: { filename: string; message: string }) => {
                setFieldError(violation.filename, violation.message);
            });
            
            // KHÔNG hiển thị toast ở đây vì đã hiển thị lỗi chi tiết dưới từng input
        } else if (error.response?.data?.msg) {
            // Xử lý lỗi từ service (ví dụ: username đã tồn tại)
            showToast(error.response.data.msg, 'danger');
        } else {
            const errorMessage = error.response?.data?.message || 'Error when create account!';
            showToast(errorMessage, 'danger');
        }
        /*********### end -Logic xử lý lỗi và bắt lỗi ném ra lỗi tt trên giao diện form input ###********* */
    }
};



  

/**********su dung useEffect để thực thi call api cho mục salary_level_id **********/
//su dung useEffect de chay duy nhat lan dau khi compoents nay render xong
    useEffect(() => {
        const fetchSalaryLevel = async () => {
            try {
                const res = await axiosAdmin.get("/salary_levels");
                console.log("Data Recieve:", res.data); // Mở Console (F12) xem chính xác tên trường là gì

                // Kiểm tra cấu trúc để set vào state cho đúng
                const data = res.data.data ? res.data.data : res.data;
                setListSalaryLevel(data);
            } catch (error) {
                console.error('Error when load data..:', error);
            }
        }
        fetchSalaryLevel();
    }, []);
 

  return(
     <>
        <h1 className="color-text-header text-center mt-4 mb-4">Add new Account</h1>
        {/* noValidate giúp loại bỏ tính năng HTML5 validation mặc định 
        bắt lỗi trên trên form: */}
        <form onSubmit={handleSubmit} noValidate>
            {/* 1. Phần Avatar */}
            <div className="mb-3 d-flex flex-column align-items-center">
                <label className="form-label fw-bold">Avatar</label>
                <Image 
                    src={imagePreview || '/assets/admin/img/no-avatar.png'} 
                    alt="Preview" 
                    className="rounded-circle mb-2 border"
                    width={150} height={150}
                    style={{ objectFit: 'cover' }}
                />
                <input className="form-control" type="file" onChange={handleImgPreview} />
            </div>

            <div className="row">
                {/* Họ tên */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <input type="text" 
                           className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                           placeholder="Nguyễn Văn A" 
                           value={name}
                           onChange={(e) => {
                                setName(e.target.value);
                                clearFieldError('name');
                            }}
                         
                    />
                    {/* báo lỗi ở ngay ô input này */}
                    {fieldErrors.name && (
                        <div className="invalid-feedback d-block">
                            {fieldErrors.name}
                        </div>
                    )}
                </div>


                {/* Email */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input 
                        type="email" 
                        className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                        placeholder="email@gmail.com" 
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            clearFieldError('email');
                        }} 
                        required 
                    />
                     {/* báo lỗi ở ngay ô input này */}
                    {fieldErrors.email && (
                        <div className="invalid-feedback d-block">
                            {fieldErrors.email}
                        </div>
                    )}
                </div>
            </div>

            <div className="row">
                {/* Username */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Tên đăng nhập</label>
                    <input 
                        type="text" 
                        className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            clearFieldError('username');
                        }} 
                        required 
                    />
                     {/* báo lỗi ở ngay ô input này */}
                    {fieldErrors.username && (
                        <div className="invalid-feedback d-block">
                            {fieldErrors.username}
                        </div>
                    )}
                </div>

                {/* Password */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Password</label>
                    <input 
                        type="password" 
                        className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            clearFieldError('password');
                        }} 
                        required 
                    />
                    {/* báo lỗi ở ngay ô input này */}
                    {fieldErrors.password && (
                        <div className="invalid-feedback d-block">
                            {fieldErrors.password}
                        </div>
                    )}
                </div>
            </div>

            <div className="row">
                {/* Giới tính */}
                <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Giới tính</label>
                    <select 
                        className={`form-control ${fieldErrors.gender ? 'is-invalid' : ''}`}
                        value={gender}
                        onChange={(e) => {
                            setGender(Number(e.target.value));
                            clearFieldError('gender');
                        }}
                    >
                        <option value={1}>Nam</option>
                        <option value={0}>Nữ</option>
                    </select>
                     {/* báo lỗi ở ngay ô input này */}
                    {fieldErrors.gender && (
                        <div className="invalid-feedback d-block">
                            {fieldErrors.gender}
                        </div>
                    )}
                </div>

                {/* Ngày sinh */}
                <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Birthday</label>
                    <input 
                        type="date" 
                        className={`form-control ${fieldErrors.birthday ? 'is-invalid' : ''}`}
                        value={birthday}
                        onChange={(e) => {
                            setBirthday(e.target.value);
                            clearFieldError('birthday');
                        }} 
                    />
                     {/* báo lỗi ở ngay ô input này */}
                    {fieldErrors.birthday && (
                        <div className="invalid-feedback d-block">
                            {fieldErrors.birthday}
                        </div>
                    )}
                </div>

                {/* Số điện thoại */}
                <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Phone</label>
                    <input 
                        type="text" 
                        className={`form-control ${fieldErrors.phone ? 'is-invalid' : ''}`}
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            clearFieldError('phone');
                        }} 
                    />
                     {/* báo lỗi ở ngay ô input này */}
                    {fieldErrors.phone && (
                        <div className="invalid-feedback d-block">
                            {fieldErrors.phone}
                        </div>
                    )}
                </div>
            </div>


            {/* địa chỉ */}
            <div className="mb-3">
                <label className="form-label fw-bold">Address</label>
                <textarea 
                    className={`form-control ${fieldErrors.address ? 'is-invalid' : ''}`}
                    rows={2} 
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                        clearFieldError('address');
                    }} 
                />
                 {/* báo lỗi ở ngay ô input này */}
                {fieldErrors.address && (
                    <div className="invalid-feedback d-block">
                        {fieldErrors.address}
                    </div>
                )}
            </div>


            <div className="row">
                {/* Bậc lương (Level) */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Salary Level</label>
                    <select 
                        className={`form-control ${fieldErrors.levelId ? 'is-invalid' : ''}`}
                        value={levelId ?? ''} 
                        onChange={(e) => {
                            setLevelId(e.target.value ? Number(e.target.value) : null);
                            clearFieldError('levelId');
                        }} 
                        required
                    >
                        <option value="">-- Seelect Salary Level --</option>
                        {listSalaryLevel && listSalaryLevel.map((lvl: any) => (
                            <option key={lvl.id} value={lvl.id}>{lvl.levelName}</option>
                        ))}
                    </select>
                     {/* báo lỗi ở ngay ô input này */}
                    {fieldErrors.levelId && (
                        <div className="invalid-feedback d-block">
                            {fieldErrors.levelId}
                        </div>
                    )}
                </div>

                {/* Trạng thái hoạt động */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Salary Level</label>
                    <div className="form-check form-switch mt-2">
                        <input className="form-check-input" type="checkbox" checked={isActive === 1}
                            onChange={(e) => setIsActive(e.target.checked ? 1 : 0)} />
                        <label className="form-check-label">Currently operating</label>
                    </div>
                </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
                <FontAwesomeIcon icon={faSave} className="me-2" />
             Save Accout
            </button>
        </form>

    </>
  )}

export default CreateModal;




