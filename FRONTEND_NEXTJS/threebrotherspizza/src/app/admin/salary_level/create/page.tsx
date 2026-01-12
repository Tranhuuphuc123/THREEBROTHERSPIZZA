/******trang thiết kế nội dung create của products pages******/
'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';

//import interface  types định kiểu dữ liệu cho dữ liệu cho page props createProduct.
import {CreateSalaryLevelPropsTypes} from "@/types/SalaryLevelTypes";

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
const CreateModal: React.FC<CreateSalaryLevelPropsTypes> = ({onReload}) => {
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
        
        const response = await axiosAdmin.post("/salary_levels/create", dataSubmit);

        showToast(response.data.msg || "Tạo tài khoản thành công!", 'success');
        if (onReload) onReload();
        closeModal();
        
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Có lỗi khi tạo tài khoản!';
        showToast(errorMessage, 'danger');
    }
};


  return(
     <>
        <h1 className="color-text-header text-center mt-4 mb-4">Add new SalaryLevel</h1>
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Level Name */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Level Name</label>
                    <input type="text" className="form-control" 
                                       placeholder="Enter supplier ocde" 
                                       onChange={(e) => setLevelName(e.target.value)} required />
                </div>
                {/* Hourly Wadge */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Hourly Wadge</label>
                    <input type="number" className="form-control" 
                                        placeholder="Enter Supplier Name" 
                                        onChange={(e) => setHourlyWage(Number(e.target.value))} required />
                </div>
            </div>


            <div className="row">
                {/* Description */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea className="form-control" 
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
  )}

export default CreateModal;




