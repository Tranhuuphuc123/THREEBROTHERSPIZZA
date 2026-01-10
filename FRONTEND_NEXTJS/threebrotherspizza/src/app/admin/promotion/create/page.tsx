'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';

//import interface types định kiểu dữ liệu cho dữ liệu cho page props createProduct.
import {PromotionTypes} from "@/types/PromotionTypes";

//import useToast trong ToastContext(viết riêng chuẩn context ấy) để sử dụng cho trang create products
import { useToast } from '@/contexts/ToastContext';
//khai bao import ModalContext mau context chung vao: luu ý import cai useModal hook ở qt3 
import {useModal} from "@/contexts/ModalContext"

//import lib fontAwesome cho NextJs
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSave} from '@fortawesome/free-solid-svg-icons'

//import lib axios xử lý call api co mục select category và supplier id
import axiosAdmin from '@/axios/axiosAdmin';
import { SubmitHandler, useForm } from 'react-hook-form';

//React.FC<CreateProductPropsTypes>: đinh kiểu dữ liệu ts cho props truyền vào component createProduct
const CreateModal =() => {
    //khai báo state tu useToast trong ToastContext truyền vào bien state
    const {showToast} = useToast()
    //state trang thai dung voi useModal cua ModalContext:
    const {closeModal} = useModal()

    /* method xử lý handleSubmit theo mẫu lib react hook form */
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError, // ## Thêm setError để set lỗi từ server vào từng field
    } = useForm<PromotionTypes>({
        // Ép kiểu defaultValues để tránh báo đỏ vì checkbox trả về boolean, interface yêu cầu number
        defaultValues: {
            isActive: true as any 
        }
    })

    const onSubmit: SubmitHandler<PromotionTypes> = async (data) => {
        try {
            const res = await axiosAdmin.post('/promotions/create', {
                name: data.name,
                discount: data.discount,
                description: data.description,
                // Ép kiểu dữ liệu từ boolean của checkbox sang number (1/0) cho Java Backend
                isActive: data.isActive ? 1 : 0,
                startDate:data.startDate,
                endDate:data.endDate
            });

            // Kiểm tra status code của HTTP phản hồi (Axios mặc định trả về status ở cấp 1)
            if (res.status === 200 || res.status === 201) {
                showToast('Create Promotion success', 'success');
                closeModal() //dong modal sau create xong
            } 
        } catch (error: any) {
            /* Xử lý lỗi validation từ server chi tiết hơn có lỗi là báo chi tiết lên các ô input*/
            if (error.response?.data?.violations && Array.isArray(error.response.data.violations)) {
            // Nếu có lỗi validation chi tiết từ server
            const violations = error.response.data.violations;
            
            // Set lỗi cho từng field trong form
            violations.forEach((violation: { filename: string; message: string }) => {
                // Map tên field từ backend (filename) sang tên field trong form
                // Backend trả về "username", "password", "email" -> map trực tiếp
                const fieldName = violation.filename as keyof PromotionTypes;
                setError(fieldName, {
                type: "server",
                message: violation.message
                });
            });
            
            // KHÔNG hiển thị toast ở đây vì đã hiển thị lỗi chi tiết dưới từng input
            // Chỉ hiển thị toast khi có lỗi khác (không phải validation)
            } else if (error.response?.data?.msg) {
            // Xử lý lỗi từ service (ví dụ: username đã tồn tại, password không đủ mạnh)
            showToast(error.response.data.msg, 'warning');
            } else {
                // Lấy thông báo lỗi từ phía Server trả về nếu có
                const errorMsg = error.response?.data?.message || error.message || 'Something went wrong';
                showToast(`${errorMsg} !`, 'warning');
            }
        }
    }


    return(
        <>
            <h1 className="color-text-header text-center mt-4 mb-4">Add new Promotion</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    {/* tên promotion */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Promotion Name</label>
                        <input type="text" 
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                id='name'
                                placeholder="Promotion Name ...." 
                                /*kỹ thuật prefix của lib react hook form thay 
                                thế cho  onChange={(e) => setState(e.target.value)}
                                để thu nhập value nhập từ bàn phím */
                                {...register("name", { required: "name not empty"})} 
                            />
                            {/* Chỗ Hiển thị lỗi validation từ server hoặc client ra ngay chỗ 
                            form input đang nhập */}
                            {errors.name && (
                            <div className="invalid-feedback d-block">
                                {errors.name.message}
                            </div>
                            )}
                    </div>
                    {/* mức giảm promotion */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Product Discount</label>
                        <input type="number" 
                                step="0.01"
                                id='discount'
                                className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
                                placeholder="0.00" 
                                /*kỹ thuật prefix của lib react hook form thay 
                                thế cho  onChange={(e) => setState(e.target.value)}
                                để thu nhập value nhập từ bàn phím */
                                {...register("discount", { 
                                        required: "discount not empty", 
                                        valueAsNumber: true  // Rất quan trọng để Java nhận kiểu Float
                                })}  />
                    </div>
                </div>

                <div className="row">
                    {/* mô tả promotion */}
                    <div className="col-md-12 mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <textarea   className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    id='description'
                                    placeholder="Description..."
                                /*kỹ thuật prefix của lib react hook form thay 
                                thế cho  onChange={(e) => setState(e.target.value)}
                                để thu nhập value nhập từ bàn phím */
                                {...register("description", { required: "description not empty" })} />
                    </div>
                </div>

                <div className="row">
                    {/* ngày bắt đầu promotion hoạt động */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">StartDate</label>
                        <input type="date" 
                                id='startDate'
                                className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                                /*kỹ thuật prefix của lib react hook form thay 
                                thế cho  onChange={(e) => setState(e.target.value)}
                                để thu nhập value nhập từ bàn phím */
                                {...register("startDate", { required: "startDate not empty" })} />
                    </div>
                    {/* ngày kết thúc promotion hoạt động */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">EndDate</label>
                        <input type="date" 
                               id='enđate'
                                className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                                /*kỹ thuật prefix của lib react hook form thay 
                                thế cho  onChange={(e) => setState(e.target.value)}
                                để thu nhập value nhập từ bàn phím */
                                {...register("endDate", { required: "endDate not empty" })} />
                    </div>
                </div>
                

               {/* Trạng thái hoạt động */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Active Status</label>
                    <div className="form-check form-switch mt-1">
                        <input className="form-check-input" 
                                type="checkbox" 
                                id="isActiveSwitch"
                                {...register("isActive")} />
                        <label className="form-check-label" htmlFor="isActiveSwitch">
                            Enable this promotion
                        </label>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save Promotion
                </button>
            </form>
        </>
    )
}

export default CreateModal;