/******trang thiết kế nội dung create của products pages******/
'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';

//import interface  types định kiểu dữ liệu cho dữ liệu cho page props createProduct.
import {CreateFeedbackPropsTypes, FeedbackTypes} from "@/types/FeedbackTypes";

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
const CreateModal: React.FC<CreateFeedbackPropsTypes> = ({onReload}) => {
    // States cho Feedback
    const [productID, setProductID] = useState<number | null>(null);
    const [userID, setUserID] = useState<number | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [message, setMessage] = useState<string>('');
    const [isActive, setIsActive] = useState<number | null>(null);

    //khai báo state tu useToast trong ToastContext truyền vào bien state
    const {showToast} = useToast()
    //state trang thai dung voi useModal cua ModalContext:
    const {closeModal} = useModal()


  /***hàm xử lý sự kiện submit nut save khi nhán lưu file: create product*****/
  //e: React.FormEvent<HTMLFormElement>: định kiểu dữ liệu ts cho event submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //ngăn chăn hành vi reload mặc định của form khi submi
    
    try {
        const dataSubmit = {
            productID: Number(productID),
            userID: Number(userID),
            rating: Number(rating),
            message: message.trim(),
            isActive: Number(isActive)            
        };
        
        const response = await axiosAdmin.post("/feedbacks/create", dataSubmit);

        showToast(response.data.msg || "Create feedback success!", 'success');
        if (onReload) onReload();
        closeModal();
        
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Error!';
        showToast(errorMessage, 'danger');
    }
};


  return(
     <>
        <h1 className="color-text-header text-center mt-4 mb-4">Add new Review</h1>
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Level Name */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">ProductID</label>
                    <input type="text" className="form-control" 
                                       placeholder="Enter supplier ocde" 
                                       onChange={(e) => setProductID(Number(e.target.value))} required />
                </div>
                {/* Hourly Wadge */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">UserID</label>
                    <input type="number" className="form-control" 
                                        placeholder="Enter Supplier Name" 
                                        onChange={(e) => setUserID(Number(e.target.value))} required />
                </div>
            </div>
            <div className="row">
                {/* Description */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Rating</label>
                    <textarea className="form-control" 
                        onChange={(e) => setRating(Number(e.target.value))} required />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Message</label>
                    <input type="number" className="form-control" 
                                        placeholder="Enter Supplier Name" 
                                        onChange={(e) => setMessage((e.target.value))} required />
                </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Save 
            </button>
        </form>

    </>
  )}

export default CreateModal;




