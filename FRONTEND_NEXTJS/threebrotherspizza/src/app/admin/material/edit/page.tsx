'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import Image from 'next/image';
import { EditPromotionProps } from "@/types/PromotionTypes";
import { useToast } from '@/contexts/ToastContext';
import { useModal } from "@/contexts/ModalContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axiosAdmin from '@/axios/axiosAdmin';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MaterialCreateTypes } from '@/types/MaterialTypes';

import { UPLOAD_URL } from "@/constants/urls";

const EditModal: React.FC<EditPromotionProps> = ({ id, onReload }) => {
    const { showToast } = useToast();
    const { closeModal } = useModal();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [suppliers, setSuppliers] = useState<any[]>([]);

    // 1. Khởi tạo React Hook Form
    const {
        register,
        handleSubmit,
        setValue, // Dùng để đổ dữ liệu vào form
        formState: { errors },
    } = useForm<MaterialCreateTypes>();

    // 2. Lấy danh sách Supplier
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await axiosAdmin.get('/suppliers/all-list');
                setSuppliers(res.data.data);
            } catch (err) {
                console.error("Failed to fetch suppliers");
            }
        };
        fetchSuppliers();
    }, []);

    // 3. Đổ dữ liệu cũ vào Form khi Edit
    useEffect(() => {
        if (!id) return;
        const fetchMaterialData = async () => {
            try {
                // Lưu ý: Endpoint này phải là lấy MATERIAL, không phải Supplier
                const res = await axiosAdmin.get(`/materials/${id}`); 
                const data = res.data.data || res.data;

                if (data) {
                    // Dùng setValue của React Hook Form để gán giá trị vào các input
                    setValue("name", data.name);
                    setValue("supplierId", data.supplierId);
                    setValue("unit", data.unit);
                    setValue("quantity", data.quantity);
                    setValue("price", data.price);
                    setValue("expireDate", data.expireDate);

                    if (data.img) {
                        setExistingImage(`${UPLOAD_URL}/${data.img}`);
                    }
                }
            } catch (error) {
                showToast("Failed to fetch material data", "warning");
            }
        };
        fetchMaterialData();
    }, [id, setValue]);

    //xử lý xem trc hình ảnh
    const handleImgPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const preView = URL.createObjectURL(selectedFile);
            setImagePreview(preView);
            setFile(selectedFile);
        }
    };

    // 4. Xử lý Update
    const onSubmit: SubmitHandler<MaterialCreateTypes> = async (data) => {
        try {
            const formData = new FormData();
            if (file) formData.append('file', file);

            const materialData = {
                name: data.name.trim(),
                supplierId: Number(data.supplierId),
                unit: data.unit.trim(),
                quantity: Number(data.quantity),
                price: parseFloat(data.price.toString()),
                expireDate: data.expireDate // Đã đúng CamelCase cho Java
            };

            formData.append('data', JSON.stringify(materialData))

            // Dùng PUT hoặc POST tùy theo API Update của bạn
            const res = await axiosAdmin.put(`/materials/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 200) {
                showToast('Update Material success!', 'success');
                if (onReload) onReload();
                closeModal();
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Update failed';
            showToast(errorMsg, 'warning');
        }
    };

    return (
        <>
            <h1 className="color-text-header text-center mt-4 mb-4">Edit Material</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Ảnh Preview */}
                <div className="mb-3 d-flex flex-column align-items-center">
                    <Image 
                        src={imagePreview || existingImage || '/assets/admin/img/no-avatar.png'} 
                        alt="Preview" 
                        className="mb-2 border rounded"
                        width={150} height={150}
                        style={{ objectFit: 'cover' }}
                    />
                    <input className="form-control" type="file" onChange={handleImgPreview} />
                </div>

                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label className="form-label fw-bold">Material Name</label>
                        <input type="text" 
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                {...register("name", { required: "Name is required" })} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Supplier</label>
                        <select className={`form-select ${errors.supplierId ? 'is-invalid' : ''}`}
                                {...register("supplierId", { required: true })}>
                            <option value="">-- Select Supplier --</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Unit</label>
                        <input type="text" className="form-control" 
                                {...register("unit", { required: true })} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Quantity</label>
                        <input type="number" className="form-control" 
                                {...register("quantity", { required: true })} />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Price</label>
                        <input type="number" step="0.01" className="form-control" 
                                {...register("price", { required: true })} />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Expire Date</label>
                        <input type="date" className="form-control" 
                                {...register("expireDate", { required: true })} />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Update Material
                </button>
            </form>
        </>
    );
};

export default EditModal;