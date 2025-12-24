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




  /***hàm xử lý sự kiện submit nut save khi nhán lưu file: create product*****/
  //e: React.FormEvent<HTMLFormElement>: định kiểu dữ liệu ts cho event submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //ngăn chăn hành vi reload mặc định của form khi submi
    
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
                showToast("Vui lòng chọn bậc lương!", 'warning');
                return;
            }

        // Gửi data dưới dạng JSON string (khớp với @RequestPart("data"))
        formData.append('data', JSON.stringify(newAccount));

        const response = await axiosAdmin.post("/users/create", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        showToast(response.data.msg || "Tạo tài khoản thành công!", 'success');
        if (onReload) onReload();
        closeModal();
        
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Có lỗi khi tạo tài khoản!';
        showToast(errorMessage, 'danger');
    }
};



  

/**********su dung useEffect để thực thi call api cho mục salary_level_id **********/
//su dung useEffect de chay duy nhat lan dau khi compoents nay render xong
    useEffect(() => {
        const fetchSalaryLevel = async () => {
            try {
                const res = await axiosAdmin.get("/salary_levels");
                console.log("Dữ liệu nhận được:", res.data); // Mở Console (F12) xem chính xác tên trường là gì

                // Kiểm tra cấu trúc để set vào state cho đúng
                const data = res.data.data ? res.data.data : res.data;
                setListSalaryLevel(data);
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
            }
        }
        fetchSalaryLevel();
    }, []);
 

  return(
     <>
        <h1 className="color-text-header text-center mt-4 mb-4">Thêm mới Account</h1>
        <form onSubmit={handleSubmit}>
            {/* 1. Phần Avatar */}
            <div className="mb-3 d-flex flex-column align-items-center">
                <label className="form-label fw-bold">Ảnh đại diện</label>
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
                    <label className="form-label fw-bold">Họ và Tên</label>
                    <input type="text" className="form-control" placeholder="Nguyễn Văn A" 
                        onChange={(e) => setName(e.target.value)} required />
                </div>
                {/* Email */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input type="email" className="form-control" placeholder="email@gmail.com" 
                        onChange={(e) => setEmail(e.target.value)} required />
                </div>
            </div>

            <div className="row">
                {/* Username */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Tên đăng nhập</label>
                    <input type="text" className="form-control" 
                        onChange={(e) => setUsername(e.target.value)} required />
                </div>
                {/* Password */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Mật khẩu</label>
                    <input type="password" className="form-control" 
                        onChange={(e) => setPassword(e.target.value)} required />
                </div>
            </div>

            <div className="row">
                {/* Giới tính */}
                <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Giới tính</label>
                    <select className="form-control" onChange={(e) => setGender(Number(e.target.value))}>
                        <option value={1}>Nam</option>
                        <option value={0}>Nữ</option>
                    </select>
                </div>
                {/* Ngày sinh */}
                <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Ngày sinh</label>
                    <input type="date" className="form-control" 
                        onChange={(e) => setBirthday(e.target.value)} />
                </div>
                {/* Số điện thoại */}
                <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Điện thoại</label>
                    <input type="text" className="form-control" 
                        onChange={(e) => setPhone(e.target.value)} />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">Địa chỉ</label>
                <textarea className="form-control" rows={2} 
                    onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="row">
                {/* Bậc lương (Level) */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Bậc lương</label>
                    <select 
                        className="form-control" 
                        value={levelId ?? ''} 
                        onChange={(e) => setLevelId(e.target.value ? Number(e.target.value) : null)} 
                        required
                    >
                        <option value="">-- Chọn bậc lương --</option>
                        {listSalaryLevel && listSalaryLevel.map((lvl: any) => (
                            <option key={lvl.id} value={lvl.id}>{lvl.levelname}</option>
                        ))}
                    </select>
                </div>

                {/* Trạng thái hoạt động */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Trạng thái</label>
                    <div className="form-check form-switch mt-2">
                        <input className="form-check-input" type="checkbox" checked={isActive === 1}
                            onChange={(e) => setIsActive(e.target.checked ? 1 : 0)} />
                        <label className="form-check-label">Đang hoạt động</label>
                    </div>
                </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Lưu tài khoản
            </button>
        </form>

    </>
  )}

export default CreateModal;




