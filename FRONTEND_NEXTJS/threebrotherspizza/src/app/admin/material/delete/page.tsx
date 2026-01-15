/*************** thiết kế form giao diện(ruột form) cho modal delete****************/
"use client";
//import useToast trong ToastContext(viết riêng chuẩn context ấy) để sử dụng cho trang create products
import { useToast } from "@/contexts/ToastContext";
//khai bao import ModalContext mau context chung vao: luu ý import cai useModal hook ở qt3
import { useModal } from "@/contexts/ModalContext";

//import interface  types định kiểu dữ liệu cho dữ liệu cho page props del Product.
import {DeleteMatPropsTypes} from "@/types/MaterialTypes";

//import lib axios xử lý call api co mục select category và supplier id
import axiosAdmin from "@/axios/axiosAdmin";


const DeleteModal: React.FC<DeleteMatPropsTypes> = ({
  id,
  onReload,
}) => {
  //khai báo state tu useToast trong ToastContext truyền vào bien state
  const { showToast } = useToast() 

  //state trang thai dung voi useModal cua ModalContext:
  const { closeModal } = useModal()

  /** mehod xử lý xóa **/
  const handleDeleteClick = async () => {
      try {
        // 1. Gọi API xóa (đường dẫn khớp với backend bạn đã cấu hình)
        const response = await axiosAdmin.delete(`/materials/delete/${id}`);

        // 2. Thông báo thành công
        showToast(response.data.msg || "Delete materials success!", "success");

        // 3. ĐÓNG MODAL TRƯỚC
        closeModal();

        // 4. KÍCH HOẠT REFRESH Ở TRANG CHA
       // Quan trọng: Gọi onReload để trang cha fetchAccounts() lại
        if (onReload) {
          // Thêm timeout 300ms để chắc chắn DB đã cập nhật xong trước khi fetch lại
          setTimeout(() => {
            onReload(); 
          }, 300);
        }

      } catch (error: any) {
        // Xử lý lỗi Optimistic Locking hoặc lỗi 404, 500
        const errorMessage = error.response?.data?.message || "Have wrong when delete!";
        showToast(errorMessage, "danger");
      }
    };

  /**trả lại giao diện cho form delete**/
  return (
    <>
      <p>Are you sure delete this value? {id}? </p>
      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
        <button className="btn btn-danger" onClick={handleDeleteClick}>
          Accept
        </button>
      </div>
    </>
  );
};

export default DeleteModal;
