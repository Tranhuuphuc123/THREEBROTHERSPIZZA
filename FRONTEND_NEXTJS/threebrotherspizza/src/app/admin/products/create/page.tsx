'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';

//import interface types định kiểu dữ liệu cho dữ liệu cho page props createProduct.
import {CreateProductPropsTypes} from "@/types/ProductTypes";

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
const CreateModal: React.FC<CreateProductPropsTypes> = ({onReload}) => {

    //khai bao bien trang thai state - state dùng cho input nhập liệu từ client
    const [listCategory, setListCategory] = useState<any[]>([]); // danh sách loại sản phẩm

    // States cho Product (Đã fix đồng bộ với logic sản phẩm)
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [shortDescription, setShortDescription] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [isActive, setIsActive] = useState<number>(1);
    const [categoryID, setCategoryID] = useState<number | null>(null);

    /***method: xử lý sự kiện khi choosefile img thì ảnh hiện lên để có thể xem trc đc ảnh vừa chọn**/
    const [imagePreview, setImagePreview] = useState<string | null>(null); // state lưu img xem trước khi create sản phẩm
    const[file, setFile] = useState<File | null>(null); // state lưu file img khi create sản phẩm

    //khai báo state tu useToast trong ToastContext truyền vào bien state
    const {showToast} = useToast()
    //state trang thai dung voi useModal cua ModalContext:
    const {closeModal} = useModal()

    /**method: xử lý xem trc img trc khi create **/
    const handleImgPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        //đọc nd tập tin cần hiển thị
        const file = e.target.files?.[0]
        if(file){
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
        e.preventDefault(); //ngăn chăn hành vi reload mặc định của form khi submit
        
        try {
            const formData = new FormData();
            // 'file' này khớp với @RequestParam("file") bên Spring Boot
            if (file) {
                formData.append('file', file);
            }

            // Tạo object khớp với interface Product (Phần data)
            const newProduct = {
                code: code.trim(),
                name: name.trim(),
                shortDescription: shortDescription.trim(),
                description: description.trim(),
                price: Number(price), // Bên TS dùng number cho cả float/double là chuẩn
                quantity: Number(quantity),
                isActive: Number(isActive),
                categoryID: categoryID ? Number(categoryID) : null,
            };

            // Kiểm tra validate cơ bản trước khi gọi API
            if (!categoryID) {
                showToast("Vui lòng chọn loại sản phẩm", 'warning');
                return;
            }

            // Gửi data dưới dạng JSON string (khớp với @RequestPart("data"))
            formData.append('data', JSON.stringify(newProduct));

            const response = await axiosAdmin.post("/products/create", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showToast(response.data.msg || "Tạo sản phẩm thành công!", 'success');
            if (onReload) onReload();
            closeModal();
            
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Có lỗi khi tạo sản phẩm!';
            showToast(errorMessage, 'danger');
        }
    };

    /**********su dung useEffect để thực thi call api cho mục danh mục và khuyến mãi **********/
    //su dung useEffect de chay duy nhat lan dau khi compoents nay render xong
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axiosAdmin.get("/categories");
                const data = res.data.data ? res.data.data : res.data;
                setListCategory(data);
            } catch (error) {
                console.error('Lỗi tải dữ liệu danh mục:', error);
            }
        }
        fetchCategory();
    }, []);

    return(
        <>
            <h1 className="color-text-header text-center mt-4 mb-4">Add new Product</h1>
            <form onSubmit={handleSubmit}>
                {/* 1. Phần Ảnh sản phẩm */}
                <div className="mb-3 d-flex flex-column align-items-center">
                    <label className="form-label fw-bold">Image of Product</label>
                    <Image 
                        src={imagePreview || '/assets/admin/img/no-avatar.png'} 
                        alt="Preview" 
                        className="mb-2 border rounded"
                        width={150} height={150}
                        style={{ objectFit: 'cover' }}
                    />
                    <input className="form-control" type="file" onChange={handleImgPreview} accept="image/*" />
                </div>

                <div className="row">
                    {/* Mã sản phẩm */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Product Code</label>
                        <input type="text" className="form-control" placeholder="Product Code..." 
                            onChange={(e) => setCode(e.target.value)} required />
                    </div>
                    {/* Tên sản phẩm */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Product Name</label>
                        <input type="text" className="form-control" placeholder="Enter Product name" 
                            onChange={(e) => setName(e.target.value)} required />
                    </div>
                </div>

                <div className="row">
                    {/* Giá bán */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Price</label>
                        <input type="number" step="0.01" className="form-control" placeholder="0.00"
                            onChange={(e) => setPrice(Number(e.target.value))} required />
                    </div>
                    {/* Số lượng */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Quantity</label>
                        <input type="number" className="form-control" placeholder="0"
                            onChange={(e) => setQuantity(Number(e.target.value))} required />
                    </div>
                </div>

                <div className="row">
                    {/* Loại sản phẩm (Category) */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Category Product</label>
                        <select 
                            className="form-select" 
                            value={categoryID ?? ''} 
                            onChange={(e) => setCategoryID(e.target.value ? Number(e.target.value) : null)} 
                            required
                        >
                            <option value="">-- Choose category of product --</option>
                            {listCategory && listCategory.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Mô tả ngắn</label>
                    <input type="text" className="form-control" 
                        onChange={(e) => setShortDescription(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Mô tả chi tiết</label>
                    <textarea className="form-control" rows={3} 
                        onChange={(e) => setDescription(e.target.value)} />
                </div>

                {/* Trạng thái hoạt động */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Trạng thái</label>
                    <div className="form-check form-switch mt-1">
                        <input className="form-check-input" type="checkbox" checked={isActive === 1}
                            onChange={(e) => setIsActive(e.target.checked ? 1 : 0)} />
                        <label className="form-check-label">Hiển thị sản phẩm</label>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Lưu sản phẩm
                </button>
            </form>
        </>
    )
}

export default CreateModal;