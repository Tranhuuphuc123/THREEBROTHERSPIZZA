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

    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');

    // xử lý hình ảnh
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [description, setDescription] = useState<string>('');


    //khởi tạo biến modalcontext toast thông báo lỗi
    const { showToast } = useToast();
    const { closeModal } = useModal();

   

    //xử lý xem trc hình ảnh khi choose file img
    const handleImgPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const preView = URL.createObjectURL(file);
            setImagePreview(preView);
            setFile(file);
        }
    };

    /* xử lý button edit của form edit modal context */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            //xử lý edit cho trường file img
            if (file) {
                formData.append('file', file);
            }

            //xử lý cho trường data
            const updateData = {
                code: code.trim(),
                name: name.trim(),
                phone: phone.trim(),
                address: address.trim(),
                description: description.trim()
            };

            formData.append('data', JSON.stringify(updateData));

            // Gọi API update (Sử dụng ID từ props)
            const response = await axiosAdmin.put(`/suppliers/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showToast(response.data.msg || "Update success!", 'success');
            if (onReload) onReload();
            closeModal();

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Wrong failed when update!';
            showToast(errorMessage, 'danger');
        }
    };



    /*mình thực hiện đổ value từ form đã create trc đó vào form edit*/
    useEffect(() => {
        if (!id) return;
        const fetchSupplier = async () => {
            try {
                const res = await axiosAdmin.get(`/suppliers/${id}`);
                console.log("Dữ liệu nhận được:", res.data); // Kiểm tra ở đây
                const data = res.data.data || res.data; // Dự phòng nếu không có .data;
                if (data) {
                    setCode(data.code ?? "");
                    setName(data.name ?? "");

                    //xử lý đô truong ảnh lên form edit
                    if (data.img) {
                        setExistingImage(`${UPLOAD_URL}/${data.img}`);
                    }

                    setPhone(data.phone ?? "");
                    setAddress(data.address ?? "");
                    setDescription(data.description ?? "");

                   
                }
            } catch (error) {
                console.error("Failed!", error);
            }
        };
        fetchSupplier();
    }, [id]);


  /* return ve UI/UX */
    return (
        <>
            <h1 className="color-text-header text-center mt-4 mb-4">Add new Suppliers</h1>
            <form onSubmit={handleSubmit}>
                {/* 1. Phần Avatar */}
                <div className="mb-3 d-flex flex-column align-items-center">
                    <label className="form-label fw-bold">Image </label>
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
                    {/* Họ tên */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Supplier Code</label>
                        <input type="text" 
                                className="form-control" 
                                placeholder="Enter supplier ocde" 
                                value={code}
                                onChange={(e) => setCode(e.target.value)} required />
                    </div>
                    {/* Email */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Supplier Name</label>
                        <input type="text" className="form-control" 
                                placeholder="Enter Supplier Name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)} required />
                    </div>
                </div>
    
                <div className="row">
                    {/* Phone */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Phone</label>
                        <input type="text" 
                                className="form-control" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    {/* Address */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Address</label>
                        <input type="text" 
                                className="form-control" 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                </div>
    
                <div className="row">
                    {/* Description */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <input type="text" 
                                className="form-control" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    {/*  */}
                    <div className="col-md-6 mb-3">
                        {/* //giu de can cau truc */}
                    </div>
                </div>
    
                <button type="submit" className="btn btn-primary w-100 mt-3">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save 
                </button>
            </form>
           
           
        </>
    );
};

export default EditModal;