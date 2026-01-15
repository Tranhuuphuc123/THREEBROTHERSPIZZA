/******trang thiết kế nội dung create của products pages******/
'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';

//import interface  types định kiểu dữ liệu cho dữ liệu cho page props createProduct.
import { CreateSupplierPropsTypes } from "@/types/SupplierTypes";

//import useToast trong ToastContext(viết riêng chuẩn context ấy) để sử dụng cho trang create products
import { useToast } from '@/contexts/ToastContext';
//khai bao import ModalContext mau context chung vao: luu ý import cai useModal hook ở qt3 
import { useModal } from "@/contexts/ModalContext"

//import lib fontAwesome cho NextJs
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons'

//import lib axios xử lý call api co mục select category và supplier id
import axiosAdmin from '@/axios/axiosAdmin';

//React.FC<CreateProductPropsTypes>: đinh kiểu dữ liệu ts cho props truyền vào component createProduct
const CreateModal: React.FC<CreateSupplierPropsTypes> = ({ onReload }) => {

    // States cho Supplier
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');

    /***method: xử lý sự kiện khi choosefile img thì ảnh hiện lên để có thể xem trc đc ảnh vừa chọn**/
    const [imagePreview, setImagePreview] = useState<string | null>(null); // state lưu img xem trước khi create sản phẩm
    const [file, setFile] = useState<File | null>(null); // state lưu file img  khi create sản phẩm

    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [description, setDescription] = useState<string>('');


    //khai báo state tu useToast trong ToastContext truyền vào bien state
    const { showToast } = useToast()
    //state trang thai dung voi useModal cua ModalContext:
    const { closeModal } = useModal()



    /**method: xử lý xem trc img trc khi create **/
    const handleImgPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        //đọc nd tập tin cần hiển thị
        const file = e.target.files?.[0]
        if (file) {
            //tạo Url láy địa chứa img xem trước
            const preView = URL.createObjectURL(file)
            //update url vào setImaePreview để cập nhặt
            setImagePreview(preView)

            //lưu file ghi nhận img vào create sản phẩm
            setFile(file)
        }
    }




    /***hàm xử lý sự kiện submit nut save khi nhán lưu file: create product*****/
    //e: React.FormEvent<HTMLFormElement>: định kiểu dữ liệu ts cho event submit form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //ngăn chăn hành vi reload mặc định của form khi submi

        try {
            const formData = new FormData();
            // 'file' này khớp với @RequestParam("file") bên Spring Boot
            if (file) {
                formData.append('file', file);
            }

            // Tạo object Account khớp với interface AccountTypes
            // Tinh chỉnh object trước khi gửi
            const newAccount = {
                code: code.trim(),
                name: name.trim(),
                phone: phone.trim(),
                address: address.trim(),
                description: description.trim()
            };

            // Gửi data dưới dạng JSON string (khớp với @RequestPart("data"))
            formData.append('data', JSON.stringify(newAccount));

            const response = await axiosAdmin.post("/suppliers/create", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showToast(response.data.msg || "Create Supplier successfully!", 'success');
            if (onReload) onReload();
            closeModal();

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Create Supplier failed!';
            showToast(errorMessage, 'danger');
        }
    };




    return (
        <>
            <h1 className="color-text-header text-center mt-4 mb-4">Add new Suppliers</h1>
            <form onSubmit={handleSubmit}>
                {/* 1. Phần Avatar */}
                <div className="mb-3 d-flex flex-column align-items-center">
                    <label className="form-label fw-bold">Image </label>
                    <Image
                        src={imagePreview || '/assets/admin/img/no-avatar.png'}
                        alt="Preview"
                        className="rounded-circle mb-2 border"
                        width={150} height={150}
                        style={{ objectFit: 'cover' }}
                    />
                    <input className="form-control" type="file" onChange={handleImgPreview} />
                </div>

                <div className="row">
                    {/* Họ tên */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Supplier Code</label>
                        <input type="text" className="form-control" placeholder="Enter supplier ocde"
                            onChange={(e) => setCode(e.target.value)} required />
                    </div>
                    {/* Email */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Supplier Name</label>
                        <input type="text" className="form-control" placeholder="Enter Supplier Name"
                            onChange={(e) => setName(e.target.value)} required />
                    </div>
                </div>

                <div className="row">
                    {/* Phone */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Phone</label>
                        <input type="text" className="form-control"
                            onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    {/* Address */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Address</label>
                        <input type="text" className="form-control"
                            onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                </div>

                <div className="row">
                    {/* Description */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <input type="text" className="form-control"
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
    )
}

export default CreateModal;




