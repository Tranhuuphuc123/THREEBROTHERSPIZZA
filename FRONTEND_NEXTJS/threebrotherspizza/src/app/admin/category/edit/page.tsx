'use client';
import { useEffect } from 'react';
import React from 'react';
import { CategoryTypes, EditCatProps } from "@/types/CategoryTypes";
import { useToast } from '@/contexts/ToastContext';
import { useModal } from "@/contexts/ModalContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axiosAdmin from '@/axios/axiosAdmin';
import { SubmitHandler, useForm } from 'react-hook-form';

const EditModal : React.FC<EditCatProps> = ({ id, onReload }) => {
    // Khởi tạo các context cần thiết
    const { showToast } = useToast();
    const { closeModal } = useModal();

   /* Khởi tạo React Hook Form 
       - register: thay thế cho onChange và value={state}
       - reset: thay thế cho các hàm setCode(data.code), setName(data.name)...
    */
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryTypes>();

    // 1. Load dữ liệu cũ của Promotion khi mở Modal (tương tự useEffect bài mẫu)
    useEffect(() => {
        if (!id) return;
        
        /* lấy value từ csdl api getbyId của promotion hiện value theo id của promotions 
        đó để đảm bảo truy vấn đúng value của đúng id promotin cần edit 
        --> sau đó nó  thực hiện đổ value lên form edit form để người dùng 
        biết form đó có gì nhìn vào và muốn fix sữa thông tin thì tùy ở họ */
        const fetchPromotionById = async () => {
            try {
                const res = await axiosAdmin.get(`/categories/${id}`);
                // Phân tách dữ liệu từ phản hồi API
                const data = res.data.data || res.data;
                
                if (data) {
                    /* Dùng hàm reset() để đổ toàn bộ data vào form.
                       Nó sẽ tự tìm các ô input có register "name", "discount"... để điền vào.
                    */
                    reset({
                        ...data,
                    });
                }
            } catch (error) {
                console.error("Load data failed!", error);
                showToast("Cannot load promotion data!", "warning");
            }
        };
        fetchPromotionById();
    }, [id, reset]);

    // 2. Xử lý Update khi nhấn nút Save (Thay thế cho handleSubmit truyền thống)
    const onSubmit: SubmitHandler<CategoryTypes> = async (data) => {
        try {
            // Chuẩn bị object gửi đi (Chuyển ngược isActive từ Boolean về Number cho Java)
            const updateData = {
                code:data.code,
                name: data.name,
                description: data.description,
            };

            const res = await axiosAdmin.put(`/categories/update/${id}`, updateData);

            if (res.status === 200 || res.status === 201) {
                showToast(res.data.msg || 'Update category success', 'success');
                if (onReload) onReload(); // Reload lại danh sách ở trang cha
                closeModal(); // Đóng modal
            } 
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Update Category failed';
            showToast(errorMsg, 'warning');
        }
    };

   return (
        <>
            <h1 className="color-text-header text-center mt-4 mb-4">Update Category</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    {/* Tên Promotion */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Code</label>
                        <input type="text"
                                className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                                placeholder="Promotion Name ...." 
                                // thay thế cho thu nhập value từ onCahnge theo useState thong thường
                                {...register("code", { required: true })} />
                    </div>
                    {/* Tên Promotion */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Name</label>
                        <input type="text"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                placeholder="Promotion Name ...." 
                                // thay thế cho thu nhập value từ onCahnge theo useState thong thường
                                {...register("name", { required: true })} />
                    </div>
                </div>

                <div className="row">
                    {/* Mô tả */}
                    <div className="col-md-12 mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <textarea className="form-control" 
                                  placeholder="Description..."
                                  {...register("description", { required: true })} />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3 mb-4">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    SAVE CHANGES
                </button>
            </form>
        </>
    );
};

export default EditModal;