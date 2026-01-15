'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import { EditFeedbackPropsTypes, FeedbackTypes } from "@/types/FeedbackTypes";
import { useToast } from '@/contexts/ToastContext';
import { useModal } from "@/contexts/ModalContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axiosAdmin from '@/axios/axiosAdmin';

// Thêm id vào destructuring ở đây để hết báo đỏ
const EditModal: React.FC<EditFeedbackPropsTypes> = ({ id, onReload }) => {
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
        
        const response = await axiosAdmin.put(`/feedbacks/update/${id}`, dataSubmit);

        showToast(response.data.msg || "Update review success !", 'success');
        if (onReload) onReload();
        closeModal();
        
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Have wrong when update!';
        showToast(errorMessage, 'danger');
    }
};



    /*mình thực hiện đổ value từ form đã create trc đó vào form edit*/
    useEffect(() => {
        if (!id) return;
        const fetchSupplier = async () => {
            try {
                const res = await axiosAdmin.get(`/feedbacks/${id}`);
                console.log("Data receive:", res.data); // Kiểm tra ở đây
                const data = res.data.data || res.data; // Dự phòng nếu không có .data;
                if (data) {
                    setProductID(data.productID ?? "");
                    setUserID(data.userID ?? "");
                    setRating(data.rating ?? "");
                    setMessage(data.message ?? "");
                    setIsActive(data.isActive ?? "");
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
            <h1 className="color-text-header text-center mt-4 mb-4">Edit review</h1>
           <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Level Name */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">ProductID</label>
                    <input type="text" className="form-control" 
                                       placeholder="Enter supplier ocde" 
                                       value={Number(productID)}
                                       onChange={(e) => setProductID(Number(e.target.value))} required />
                </div>
                {/* Hourly Wadge */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">UserID</label>
                    <input type="number" className="form-control" 
                                        placeholder="Enter Supplier Name" 
                                        value={Number(userID)}
                                        onChange={(e) => setUserID(Number(e.target.value))} required />
                </div>
            </div>


            <div className="row">
                {/* Description */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Rating</label>
                    <textarea className="form-control" 
                                value={Number(rating)}
                                onChange={(e) => setRating(Number(e.target.value))} required />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Message</label>
                    <input type="number" className="form-control" 
                                        value={Number(message)} 
                                        onChange={(e) => setMessage((e.target.value))} required />
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