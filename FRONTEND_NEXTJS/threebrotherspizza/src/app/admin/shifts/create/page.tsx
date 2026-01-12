/******trang thiết kế nội dung create của products pages******/
'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';

//import interface  types định kiểu dữ liệu cho dữ liệu cho page props createProduct.
import {CreateShiftPropsTypes} from "@/types/ShiftTypes";

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
const CreateModal: React.FC<CreateShiftPropsTypes> = ({onReload}) => {
    // States cho SalaryLevel
    const [shiftName, setShiftName] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [wageMultiplier, setWageMultiplier] = useState<number>();
    const [bonus, setBonus] = useState<number>();

    //khai báo state tu useToast trong ToastContext truyền vào bien state
    const {showToast} = useToast()
    //state trang thai dung voi useModal cua ModalContext:
    const {closeModal} = useModal()


  /***hàm xử lý sự kiện submit nut save khi nhán lưu file: create product*****/
  //e: React.FormEvent<HTMLFormElement>: định kiểu dữ liệu ts cho event submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //ngăn chăn hành vi reload mặc định của form khi submi

    // Hàm format xóa chữ T và thêm giây
    const formatToBackend = (dateTimeStr: string) => {
        if (!dateTimeStr) return null;
        let formatted = dateTimeStr.replace('T', ' '); // Đổi T thành khoảng trắng
        return formatted.length === 16 ? `${formatted}:00` : formatted;
    };
    
    try {
        const dataSubmit = {
            shiftName: shiftName.trim(),
            startTime: formatToBackend(startTime), //xử lý cho chọn giờ trong thời gian
            endTime: formatToBackend(endTime),
            wageMultiplier:Number(wageMultiplier),
            bonus: Number(bonus)
        };
        
        const response = await axiosAdmin.post("/shifts/create", dataSubmit);

        showToast(response.data.msg || "Create shifts success!", 'success');
        if (onReload) onReload();
        closeModal();
        
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Create shifts failed!';
        showToast(errorMessage, 'danger');
    }
};




  return(
     <>
        <h1 className="color-text-header text-center mt-4 mb-4">Add new Shifts</h1>
        <form onSubmit={handleSubmit} noValidate>
            <div className="row">
                {/* ShiftName */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Shift Name</label>
                    <input type="text" className="form-control" 
                                       placeholder="Enter Shift Name" 
                                       onChange={(e) => setShiftName(e.target.value)} required />
                </div>
                {/* StartTime */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Start Time</label>
                    <input type="datetime-local" className="form-control" 
                                        placeholder="Enter  StartTIme" 
                                        onChange={(e) => setStartTime(e.target.value)} required />
                </div>
            </div>


            <div className="row">
                {/* endTime */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">End Time</label>
                    <input type='datetime-local' className="form-control" 
                        onChange={(e) => setEndTime(e.target.value)} required />
                </div>
                {/* wageMultiplier */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold"> WageMultiplier </label>
                    <input type='number' className="form-control" 
                        onChange={(e) => setWageMultiplier(Number(e.target.value))} required />
                </div>
            </div>

              <div className="row">
                {/* bonus */}
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Bonus</label>
                    <input type='number' className="form-control" 
                        onChange={(e) => setBonus(Number(e.target.value))} required />
                </div>
                {/*  */}
                <div className="col-md-6 mb-3">
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




