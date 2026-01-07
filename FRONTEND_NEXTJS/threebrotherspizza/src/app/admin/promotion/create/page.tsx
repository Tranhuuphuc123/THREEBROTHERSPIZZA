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
            // Lấy thông báo lỗi từ phía Server trả về nếu có
            const errorMsg = error.response?.data?.message || error.message || 'Something went wrong';
            showToast(`${errorMsg} !`, 'warning');
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
                                placeholder="Promotion Name ...." 
                                /*kỹ thuật prefix của lib react hook form thay 
                                thế cho  onChange={(e) => setState(e.target.value)}
                                để thu nhập value nhập từ bàn phím */
                                {...register("name", { required: true })} />
                    </div>
                    {/* mức giảm promotion */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Product Discount</label>
                        <input type="number" 
                                step="0.01"
                                className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
                                placeholder="0.00" 
                                /*kỹ thuật prefix của lib react hook form thay 
                                thế cho  onChange={(e) => setState(e.target.value)}
                                để thu nhập value nhập từ bàn phím */
                                {...register("discount", { 
                                        required: true, 
                                        valueAsNumber: true  // Rất quan trọng để Java nhận kiểu Float
                                })}  />
                    </div>
                </div>

                <div className="row">
                    {/* mô tả promotion */}
                    <div className="col-md-12 mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <textarea  className="form-control" 
                                    placeholder="Description..."
                                /*kỹ thuật prefix của lib react hook form thay 
                                thế cho  onChange={(e) => setState(e.target.value)}
                                để thu nhập value nhập từ bàn phím */
                                {...register("description", { required: true })} />
                    </div>
                </div>

                <div className="row">
                    {/* ngày bắt đầu promotion hoạt động */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">StartDate</label>
                        <input type="date" 
                                className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                                /*kỹ thuật prefix của lib react hook form thay 
                                thế cho  onChange={(e) => setState(e.target.value)}
                                để thu nhập value nhập từ bàn phím */
                                {...register("startDate", { required: true })} />
                    </div>
                    {/* ngày kết thúc promotion hoạt động */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">EndDate</label>
                        <input type="date" 
                                className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                                /*kỹ thuật prefix của lib react hook form thay 
                                thế cho  onChange={(e) => setState(e.target.value)}
                                để thu nhập value nhập từ bàn phím */
                                {...register("endDate", { required: true })} />
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