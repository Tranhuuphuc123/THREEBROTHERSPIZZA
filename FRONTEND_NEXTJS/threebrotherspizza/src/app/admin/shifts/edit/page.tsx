'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import { EditSalaryLevelPropsTypes } from "@/types/SalaryLevelTypes";
import { useToast } from '@/contexts/ToastContext';
import { useModal } from "@/contexts/ModalContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axiosAdmin from '@/axios/axiosAdmin';

// Thêm id vào destructuring ở đây để hết báo đỏ
const EditModal: React.FC<EditSalaryLevelPropsTypes> = ({ id, onReload }) => {

    // States cho SalaryLevel
    const [levelName, setLevelName] = useState<string>('');
    const [hourlyWage, setHourlyWage] = useState<number | null>(null);
    const [description, setDescription] = useState<string>('');

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
            levelName: levelName.trim(),
            hourlyWage: Number(hourlyWage), // Ép kiểu số ngay tại đây
            description: description.trim(),
        };
        
        const response = await axiosAdmin.put(`/salary_levels/update/${id}`, dataSubmit);

        showToast(response.data.msg || "Update Salary Level success !", 'success');
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
                const res = await axiosAdmin.get(`/salary_levels/${id}`);
                console.log("Data receive:", res.data); // Kiểm tra ở đây
                const data = res.data.data || res.data; // Dự phòng nếu không có .data;
                if (data) {
                    setLevelName(data.levelName ?? "");
                    setHourlyWage(data.hourlyWage ?? "");
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
            <h1 className="color-text-header text-center mt-4 mb-4">Edit Salarey Level</h1>
           <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Level Name */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Level Name</label>
                    <input type="text" className="form-control" 
                                       placeholder="Enter supplier ocde" 
                                       value={levelName}
                                       onChange={(e) => setLevelName(e.target.value)} required />
                </div>
                {/* Hourly Wadge */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Hourly Wadge</label>
                    <input type="number" className="form-control" 
                                        placeholder="Enter Supplier Name" 
                                        value={Number(hourlyWage)}
                                        onChange={(e) => setHourlyWage(Number(e.target.value))} required />
                </div>
            </div>


            <div className="row">
                {/* Description */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea className="form-control" 
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