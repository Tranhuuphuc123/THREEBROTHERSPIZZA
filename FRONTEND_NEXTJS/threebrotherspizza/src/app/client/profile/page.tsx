'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import React from 'react';
import { EditAccountPropsTypes } from "@/types/AccountTypes";
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCamera, faUser, faEnvelope, faPhone, faMapMarkerAlt, faCakeCandles, faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import axiosClient from '@/axios/axiosClient';
import { UPLOAD_URL } from "@/constants/urls";


const EditProfile: React.FC<EditAccountPropsTypes> = ({ id, onReload }) => {
    //import context modal
    const { showToast } = useToast();
    //khởi tạo biến router 
    const router = useRouter();

    // ... Giữ nguyên toàn bộ logic State và Handlers của bạn ...
    // const [listSalaryLevel, setListSalaryLevel] = useState<any[]>([]);
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    // const [password, setPassword] = useState<string>('');
    const [gender, setGender] = useState<number>(1);
    const [birthday, setBirthday] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    // const [levelId, setLevelId] = useState<number | null>(null);
    // const [isActive, setIsActive] = useState<number>(1);

    //nhóm xử lý kiểm tra trạng thái ảnh xem trc và ảnh có rồi thì hiện lại trong update
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    /* method xử lý coi trc ảnh khi choose img */
    const handleImgPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const preView = URL.createObjectURL(file);
            setImagePreview(preView);
            setFile(file);
        }
    };

    /* method xử lý nut submit khi bấm update cập nhật thông tin profile */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        //lấy id từ  localstorage
        const userId = localStorage.getItem("user_id");
        try {
            const formData = new FormData();
            if (file) formData.append('file', file);
            const updateData = {
                name: name.trim(),
                username: username.trim(),
                // password: password,
                gender: Number(gender),
                birthday: birthday === "" ? null : birthday,
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim(),
                // levelId: levelId ? Number(levelId) : null,
                // isActive: Number(isActive)
            };
            formData.append('data', JSON.stringify(updateData));
            const response = await axiosClient.put(`/users/update/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showToast(response.data.msg || "Cập nhật thành công!", 'success');
            if (onReload) onReload();
            router.push('/client')
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Có lỗi khi cập nhật!', 'danger');
        }
    };

    /* Load dữ liệu cũ của Account để vào form edit*/
    useEffect(() => {
        //0. lấy userId từ localStorage
        const effectiveId = localStorage.getItem("user_id");

        // 1. Kiểm tra nghiêm ngặt id
        if (!effectiveId) {
            console.warn("EditProfile: ID không hợp lệ hoặc chưa được truyền vào");
            return;
        }
        const fetchAccountById = async () => {
            try {
                // Đảm bảo truyền vào là số khi gọi API
                const targetId = Number(effectiveId);
                console.log("Đang fetch dữ liệu cho ID:", targetId);

                const res = await axiosClient.get(`/users/${targetId}`);
                // 2. Kiểm tra cấu trúc data trả về từ Backend (thường là res.data hoặc res.data.data)
                const data = res.data.data || res.data;

                if (data) {
                    setName(data.name ?? "");
                    setUsername(data.username ?? "");
                    // setPassword(""); // Không hiện mật khẩu cũ
                    setGender(data.gender ?? 1);

                    // Trong useEffect fetchAccountById
                    if (data.birthday) {
                        // Cắt lấy 10 ký tự đầu: "YYYY-MM-DD"
                        setBirthday(data.birthday.substring(0, 10)); 
                    } else {
                        setBirthday("");
                    }

                    setEmail(data.email ?? "");
                    setPhone(data.phone ?? "");
                    setAddress(data.address ?? "");
                    // setLevelId(data.levelId ? Number(data.levelId) : null);
                    // setIsActive(data.isActive ?? 1);
                   
                    if (data.avatar) {
                        setExistingImage(`${UPLOAD_URL}/${data.avatar}`);
                    }
                }
            } catch (error) { console.error("Lỗi khi tải dữ liệu", error); }
        };
        fetchAccountById();
    }, [id]);

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
             <form onSubmit={handleSubmit}>
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12">
                        <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                            <div className="row g-0">
                                {/* --- SIDEBAR TRÁI: AVATAR & INFO TÓM TẮT --- */}
                                <div className="col-md-4 bg-white border-end p-4 text-center d-flex flex-column align-items-center justify-content-center">
                                    <div className="position-relative mb-4 group-avatar">
                                    {imagePreview ? (
                                        <Image src={imagePreview} 
                                                    alt="Preview" 
                                                    className="rounded-circle mb-2 border" 
                                                    width={150} height={150} 
                                                    style={{ objectFit: 'cover' }} />
                                        ) : existingImage ? (
                                            <Image src={existingImage} 
                                                    alt="Current" 
                                                    className="rounded-circle mb-2 border" 
                                                    width={150} height={150} 
                                                    style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <Image src={'/assets/admin/img/no-avatar.png'} 
                                                    alt="No Avatar" 
                                                    className="rounded-circle mb-2 border" 
                                                    width={150} height={150} 
                                                    style={{ objectFit: 'cover' }} />
                                        )} 
                                        <label htmlFor="avatar-upload" className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle shadow" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FontAwesomeIcon icon={faCamera} />
                                            <input id="avatar-upload" type="file" hidden onChange={handleImgPreview} />
                                        </label>
                                    </div>
                                    <h4 className="fw-bold mb-1">{name || 'Chưa đặt tên'}</h4>
                                    <p className="text-muted mb-3">@{username}</p>
                                </div>

                                {/* --- CỘT PHẢI: FORM CHI TIẾT --- */}
                                <div className="col-md-8 p-4 p-lg-5">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h3 className="fw-bold m-0 color-text-header">Hồ Sơ Cá Nhân</h3>
                                    </div>

                                
                                    <div className="row">
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-semibold small text-uppercase"> 
                                                <FontAwesomeIcon icon={faUser}
                                                                className="me-2 opacity-50"/> Họ và Tên</label>
                                            <input type="text" 
                                                    className="form-control form-control-lg border-2 shadow-none shadow-sm-hover" 
                                                    value={name} 
                                                    onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-semibold small text-uppercase"> 
                                                    <FontAwesomeIcon icon={faEnvelope} 
                                                                    className="me-2 opacity-50"/> Email</label>
                                            <input type="email" 
                                                    className="form-control form-control-lg border-2 shadow-none shadow-sm-hover" 
                                                    value={email} 
                                                    onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label fw-semibold small text-uppercase opacity-75">Tên đăng nhập</label>
                                            <input type="text" 
                                                    className="form-control form-control-lg bg-light border-0" 
                                                    value={username} 
                                                    readOnly disabled />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            {/* --- 
                                                 <label className="form-label fw-semibold small text-uppercase">Mật khẩu mới</label>
                                            <input type="password" 
                                                    placeholder="Để trống nếu giữ nguyên" 
                                                    className="form-control form-control-lg border-2 shadow-none shadow-sm-hover" 
                                                    value={password} 
                                                    onChange={(e) => setPassword(e.target.value)} />
                                            --- */}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-4">
                                            <label className="form-label fw-semibold small text-uppercase"> 
                                                <FontAwesomeIcon icon={faVenusMars} 
                                                                className="me-2 opacity-50"/> Giới tính</label>
                                            <select className="form-select form-select-lg border-2" 
                                                    value={gender} 
                                                    onChange={(e) => setGender(Number(e.target.value))}>
                                                <option value={1}>Nam</option>
                                                <option value={0}>Nữ</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 mb-4">
                                            <label className="form-label fw-semibold small text-uppercase"> 
                                                <FontAwesomeIcon icon={faCakeCandles} 
                                                    className="me-2 opacity-50"/> Ngày sinh</label>
                                            <input type="date" 
                                                    className="form-control form-control-lg border-2 shadow-none shadow-sm-hover custom-date-input" 
                                                    value={birthday} 
                                                    onChange={(e) => setBirthday(e.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-4">
                                            <label className="form-label fw-semibold small text-uppercase"> 
                                                <FontAwesomeIcon icon={faPhone} 
                                                    className="me-2 opacity-50"/> Điện thoại</label>
                                            <input type="text" 
                                                    className="form-control form-control-lg border-2 shadow-none shadow-sm-hover" 
                                                    value={phone} 
                                                    onChange={(e) => setPhone(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold small text-uppercase"> 
                                            <FontAwesomeIcon icon={faMapMarkerAlt} 
                                                className="me-2 opacity-50"/> Địa chỉ cư trú</label>
                                        <textarea className="form-control border-2 shadow-none shadow-sm-hover" 
                                                    rows={2} 
                                                    value={address} 
                                                    onChange={(e) => setAddress(e.target.value)} />
                                    </div>

                                    <div className="pt-3">
                                        <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm fw-bold py-3 text-uppercase" style={{ borderRadius: '10px', letterSpacing: '1px' }}>
                                            <FontAwesomeIcon icon={faSave} className="me-2" />
                                            SAVE CHANGES
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            
            {/* CSS bổ sung để làm đẹp hơn */}
            <style jsx>{`
            /* Ép icon lịch hiển thị trở lại */
                .custom-date-input::-webkit-calendar-picker-indicator {
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%23666" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
                    background-repeat: no-repeat;
                    background-position: center;
                    cursor: pointer;
                    opacity: 1;
                    display: block;
                    width: 20px;
                    height: 20px;
                    /* Chỉnh màu icon sang xám đậm để dễ thấy trên nền trắng */
                    filter: invert(0.5); 
                }

                /* Đảm bảo icon không bị ẩn bởi browser */
                .custom-date-input {
                    position: relative;
                    -webkit-appearance: listbox !important; /* Quan trọng: Ghi đè CSS của Bootstrap */
                    appearance: listbox !important;
                }
                .form-control:focus, .form-select:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
                }
                .shadow-sm-hover:hover {
                    border-color: #0a4e92ff;
                }
                .group-avatar:hover label {
                    transform: scale(1.1);
                    transition: all 0.2s ease;
                }
                .color-text-header {
                    color: #2c3e50;
                }
            `}</style>
        </div>
    );
};

export default EditProfile;