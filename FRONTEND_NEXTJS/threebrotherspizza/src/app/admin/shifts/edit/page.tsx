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
        
        const response = await axiosAdmin.put(`/shifts/update/${id}`, dataSubmit);

        showToast(response.data.msg || "Update Shift success !", 'success');
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
                const res = await axiosAdmin.get(`/shifts/${id}`);
                console.log("Data receive:", res.data); // Kiểm tra ở đây
                const data = res.data.data || res.data; // Dự phòng nếu không có .data;
                if (data) {
                    setShiftName(data.shiftName ?? "");
                    setStartTime(data.startTime ?? "");
                    setEndTime(data.endTime ?? "");
                    setWageMultiplier(data.wageMultiplier ?? "")
                    setBonus(data.bonus ?? "")
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
            <h1 className="color-text-header text-center mt-4 mb-4">Edit Shift Level</h1>
            <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                    {/* ShiftName */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Shift Name</label>
                        <input type="text" className="form-control" 
                                        value={shiftName}
                                        placeholder="Enter Shift Name" 
                                        onChange={(e) => setShiftName(e.target.value)} required />
                    </div>
                    {/* StartTime */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Start Time</label>
                        <input type="datetime-local" className="form-control" 
                                            placeholder="Enter  StartTIme" 
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)} required />
                    </div>
                </div>


                <div className="row">
                    {/* endTime */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">End Time</label>
                        <input type='datetime-local' className="form-control" 
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)} required />
                    </div>
                    {/* wageMultiplier */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold"> WageMultiplier </label>
                        <input type='number' className="form-control" 
                            value={wageMultiplier}
                            onChange={(e) => setWageMultiplier(Number(e.target.value))} required />
                    </div>
                </div>

                <div className="row">
                    {/* bonus */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Bonus</label>
                        <input type='number' className="form-control" 
                            value={bonus}
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
    );
};

export default EditModal;