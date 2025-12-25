'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import React from 'react';
import { EditAccountPropsTypes } from "@/types/AccountTypes";
import { useToast } from '@/contexts/ToastContext';
import { useModal } from "@/contexts/ModalContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axiosAdmin from '@/axios/axiosAdmin';
import { UPLOAD_URL } from "@/constants/urls";

// Thêm id vào destructuring ở đây để hết báo đỏ
const EditModal: React.FC<EditAccountPropsTypes> = ({ id, onReload }) => {

    const [listSalaryLevel, setListSalaryLevel] = useState<any[]>([]);
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [gender, setGender] = useState<number>(1);
    const [birthday, setBirthday] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [levelId, setLevelId] = useState<number | null>(null);
    const [isActive, setIsActive] = useState<number>(1);

    const { showToast } = useToast();
    const { closeModal } = useModal();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleImgPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const preView = URL.createObjectURL(file);
            setImagePreview(preView);
            setFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            }

            const updateData = {
                name: name.trim(),
                username: username.trim(),
                password: password, // Nếu trống, backend sẽ giữ nguyên pass cũ
                gender: Number(gender),
                birthday: birthday === "" ? null : birthday,
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim(),
                levelId: levelId ? Number(levelId) : null,
                isActive: Number(isActive)
            };

            formData.append('data', JSON.stringify(updateData));

            // Gọi API update (Sử dụng ID từ props)
            const response = await axiosAdmin.put(`/users/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showToast(response.data.msg || "Cập nhật thành công!", 'success');
            if (onReload) onReload();
            closeModal();

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Có lỗi khi cập nhật!';
            showToast(errorMessage, 'danger');
        }
    };

    // Load danh sách bậc lương
    useEffect(() => {
        const fetchSalaryLevel = async () => {
            try {
                const res = await axiosAdmin.get("/salary_levels");
                const data = res.data.data ? res.data.data : res.data;
                setListSalaryLevel(data);
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
            }
        };
        fetchSalaryLevel();
    }, []);

    // Load dữ liệu cũ của Account để vào form edit
    useEffect(() => {
        if (!id) return;
        const fetchAccountById = async () => {
            try {
                const res = await axiosAdmin.get(`/users/${id}`);
                console.log("Dữ liệu nhận được:", res.data); // Kiểm tra ở đây
                const data = res.data.data || res.data; // Dự phòng nếu không có .data;
                if (data) {
                    setName(data.name ?? "");
                    setUsername(data.username ?? "");
                    setPassword(""); // Không hiện mật khẩu cũ
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
                    setAddress(data.address ?? ""); // Đổi false thành ""
                    setLevelId(data.levelId ? Number(data.levelId) : null);
                    setIsActive(data.isActive ?? 1);

                    if (data.avatar) {
                        setExistingImage(`${UPLOAD_URL}/${data.avatar}`);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu", error);
            }
        };
        fetchAccountById();
    }, [id]);

    return (
        <>
            <h1 className="color-text-header text-center mt-4 mb-4">Update Account</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 d-flex flex-column align-items-center">
                    <label className="form-label fw-bold">Ảnh đại diện</label>
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
                    <input className="form-control" type="file" onChange={handleImgPreview} />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Họ và Tên</label>
                        <input type="text" 
                                className="form-control" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Tên đăng nhập</label>
                        <input type="text" className="form-control" value={username} readOnly disabled />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Mật khẩu mới (để trống nếu giữ nguyên)</label>
                        <input type="password" placeholder="********" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Giới tính</label>
                        <select className="form-control" value={gender} onChange={(e) => setGender(Number(e.target.value))}>
                            <option value={1}>Nam</option>
                            <option value={0}>Nữ</option>
                        </select>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Ngày sinh</label>
                        <input type="date" 
                                className="form-control" 
                                value={birthday} 
                                onChange={(e) => setBirthday(e.target.value)} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Điện thoại</label>
                        <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Địa chỉ</label>
                    <textarea className="form-control" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Bậc lương</label>
                        <select className="form-control" value={levelId ?? ''} onChange={(e) => setLevelId(e.target.value ? Number(e.target.value) : null)} required >
                            <option value="">-- Chọn bậc lương --</option>
                            {listSalaryLevel.map((lvl: any) => (
                                <option key={lvl.id} value={lvl.id}>{lvl.levelname}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Trạng thái</label>
                        <div className="form-check form-switch mt-2">
                            <input className="form-check-input" type="checkbox" checked={isActive === 1} onChange={(e) => setIsActive(e.target.checked ? 1 : 0)} />
                            <label className="form-check-label">Đang hoạt động</label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    SAVE CHANGE
                </button>
            </form>
        </>
    );
};

export default EditModal;