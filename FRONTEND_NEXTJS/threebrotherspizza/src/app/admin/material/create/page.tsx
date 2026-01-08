'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/contexts/ToastContext';
import { useModal } from '@/contexts/ModalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axiosAdmin from '@/axios/axiosAdmin';
import { SubmitHandler, useForm } from 'react-hook-form';
import {MaterialCreateTypes} from '@/types/MaterialTypes'



const CreateModal = ({ onReload }: { onReload?: () => void }) => {
    const { showToast } = useToast();
    const { closeModal } = useModal();

    // 1. States để xử lý Preview ảnh (giống phần Supplier)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [suppliers, setSuppliers] = useState<any[]>([]); // Lưu danh sách NCC để chọn

    // 2. React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<MaterialCreateTypes>();

    // Lấy danh sách Supplier để đổ vào Select Option khi mở Modal
    useEffect(() => {
        /*=lấy khóa ngoại của supplier */
        const fetchSuppliers = async () => {
            try {
                //lấy khóa ngoại ủa supplier
                const res = await axiosAdmin.get('/suppliers/all-list'); 
                setSuppliers(res.data.data);
            } catch (err) {
                console.error("Failed to fetch suppliers");
            }
        };
        fetchSuppliers();
    }, []);

    // 3. Hàm xử lý Preview ảnh
    const handleImgPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const preView = URL.createObjectURL(selectedFile);
            setImagePreview(preView);
            setFile(selectedFile); // Lưu file để gửi đi
        }
    };

    // 4. Xử lý Submit Form
    const onSubmit: SubmitHandler<MaterialCreateTypes> = async (data) => {
        try {
            const formData = new FormData();

            // Append File ảnh (nếu có)
            if (file) {
                formData.append('file', file);
            }

            // Append Object Data (Chuyển đổi các trường số cho khớp Java)
            const materialData = {
                name: data.name.trim(),
                supplier_id: Number(data.supplier_id),
                unit: data.unit.trim(),
                quantity: Number(data.quantity),
                price: parseFloat(data.price.toString()),
                expire_date: data.expire_date
            };

            // Bọc JSON vào Blob để tránh lỗi Media Type Not Supported
            formData.append('data', new Blob([JSON.stringify(materialData)], {
                type: 'application/json'
            }));

            const res = await axiosAdmin.post('/materials/create', formData);

            if (res.status === 200 || res.status === 201) {
                showToast('Create Material success!', 'success');
                if (onReload) onReload();
                closeModal();
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Something went wrong';
            showToast(`${errorMsg} !`, 'warning');
        }
    };

    return (
        <>
            <h1 className="color-text-header text-center mt-4 mb-4">Add New Material</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                
                {/* Phần Avatar/Image Preview */}
                <div className="mb-3 d-flex flex-column align-items-center">
                    <label className="form-label fw-bold">Material Image</label>
                    <Image 
                        src={imagePreview || '/assets/admin/img/no-avatar.png'} 
                        alt="Preview" 
                        className="mb-2 border rounded"
                        width={150} height={150}
                        style={{ objectFit: 'cover' }}
                    />
                    <input className="form-control" type="file" onChange={handleImgPreview} />
                </div>

                <div className="row">
                    {/* Tên vật liệu */}
                    <div className="col-md-12 mb-3">
                        <label className="form-label fw-bold">Material Name</label>
                        <input type="text" 
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                placeholder="Enter material name..." 
                                {...register("name", { required: "Name is required" })} />
                    </div>
                </div>

                <div className="row">
                    {/* Supplier ID - Chọn từ danh sách */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Supplier</label>
                        <select className={`form-select ${errors.supplier_id ? 'is-invalid' : ''}`}
                                {...register("supplier_id", { required: true })}>
                            <option value="">-- Select Supplier --</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Đơn vị tính */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Unit</label>
                        <input type="text" className="form-control" placeholder="Kg, Box, Pcs..." 
                                {...register("unit", { required: true })} />
                    </div>
                </div>

                <div className="row">
                    {/* Số lượng */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Quantity</label>
                        <input type="number" className="form-control" 
                                {...register("quantity", { required: true, min: 0 })} />
                    </div>

                    {/* Giá tiền */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Price</label>
                        <input type="number" step="0.01" className="form-control" 
                                {...register("price", { required: true })} />
                    </div>

                    {/* Hạn sử dụng */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Expire Date</label>
                        <input type="date" className="form-control" 
                                {...register("expire_date", { required: true })} />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save Material
                </button>
            </form>
        </>
    );
}

export default CreateModal;