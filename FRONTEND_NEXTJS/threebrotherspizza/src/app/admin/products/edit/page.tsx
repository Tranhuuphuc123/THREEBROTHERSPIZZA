'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import React from 'react';
import { EditProductPropsTypes } from "@/types/ProductTypes";
import { useToast } from '@/contexts/ToastContext';
import { useModal } from "@/contexts/ModalContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axiosAdmin from '@/axios/axiosAdmin';
import { UPLOAD_URL } from "@/constants/urls";

// Thêm id vào destructuring ở đây để hết báo đỏ
const EditModal: React.FC<EditProductPropsTypes> = ({ id, onReload }) => {

    //state phục phục cập nhật list danh sách các category vào mục select á
    const [listCategory, setListCategory] = useState<any[]>([]);
    
    //nhóm state value thu thập thông tin từ người dùng (State dành cho Product)
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [shortDescription, setShortDescription] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [isActive, setIsActive] = useState<number>(1);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [productType, setProductType] = useState<string>('');

    //khởi tạo toastcontext
    const { showToast } = useToast();
    const { closeModal } = useModal();

    //xem img trc khi update
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);


    /* method xử lý xem trc ảnh */
    const handleImgPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const preView = URL.createObjectURL(file);
            setImagePreview(preView);
            setFile(file);
        }
    };

    /* method xử lý hành động submit khi ấn nút update trên form */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            }

            const updateData = {
                code: code.trim(),
                name: name.trim(),
                shortDescription: shortDescription.trim(),
                description: description.trim(),
                price: Number(price), // Bên TS dùng number cho cả float/double là chuẩn
                quantity: Number(quantity),
                isActive: Number(isActive),
                categoryId: categoryId ? Number(categoryId) : null,

                //nếu chọn notype trong select khi nhấn submit thi nó lưu là null
                productType: productType === 'No type' || productType === '' ? null : productType
            };

            formData.append('data', JSON.stringify(updateData));

            // Gọi API update (Sử dụng ID từ props)
            const response = await axiosAdmin.put(`/products/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showToast(response.data.msg || "Update success!", 'success');
            if (onReload) onReload();
            closeModal();

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'update failed!';
            showToast(errorMessage, 'danger');
        }
    };

    // Load danh sách loại bánh category
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axiosAdmin.get("/categories/listCat");
                const data = res.data.data ? res.data.data : res.data;
                setListCategory(data);
            } catch (error) {
                console.error('Load value failed !:', error);
            }
        };
        fetchCategory();
    }, []);



    // Load dữ liệu cũ của Product để vào form edit
    useEffect(() => {
        if (!id) return;
        const fetchProductById = async () => {
            try {
                const res = await axiosAdmin.get(`/products/${id}`);
                console.log("Data receive:", res.data); // Kiểm tra ở đây
                const data = res.data.data || res.data; // Dự phòng nếu không có .data;
                if (data) {
                    setCode(data.code ?? "");
                    setName(data.name ?? "");

                    //đổ ảnh (Lưu ý: Bạn dùng data.image hay data.avatar thì đổi tên cho khớp nhé)
                    if (data.image) {
                        setExistingImage(`${UPLOAD_URL}/${data.image}`);
                    }
                    
                    setShortDescription(data.shortDescription ?? ""); 
                    setDescription(data.description ?? "");
                    setPrice(Number(data.price));
                    setQuantity(Number(data.quantity));
                    setIsActive(data.isActive ?? 1);
                    setCategoryId(data.categoryId ? Number(data.categoryId) : null);

                    //HIỂN THỊ ĐÚNG DỮ LIỆU CŨ TRÊN SELECT
                    setProductType(data.productType ?? "");
                }
            } catch (error) {
                console.error("Load data failed!", error);
            }
        };
        fetchProductById();
    }, [id]);

    return (
        <>
            <h1 className="color-text-header text-center mt-4 mb-4">Update Product</h1>
            <form onSubmit={handleSubmit}>
                {/* Phần hiển thị và chọn Ảnh */}
                <div className="mb-3 d-flex flex-column align-items-center">
                    <label className="form-label fw-bold">Product Image</label>
                    {imagePreview ? (
                        <Image src={imagePreview} 
                                alt="Preview" 
                                className="rounded mb-2 border" 
                                width={150} height={150} 
                                style={{ objectFit: 'cover' }} />
                    ) : existingImage ? (
                        <Image src={existingImage} 
                                alt="Current" 
                                className="rounded mb-2 border" 
                                width={150} height={150} 
                                style={{ objectFit: 'cover' }} />
                    ) : (
                        <Image src={'/assets/admin/img/no-avatar.png'} 
                                alt="No Image" 
                                className="rounded mb-2 border" 
                                width={150} height={150} 
                                style={{ objectFit: 'cover' }} />
                    )}
                    <input className="form-control w-50" type="file" onChange={handleImgPreview} />
                </div>

                <div className="row">
                    {/* Mã sản phẩm */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Product Code</label>
                        <input type="text" 
                                className="form-control" 
                                value={code} 
                                onChange={(e) => setCode(e.target.value)} />
                    </div>
                    {/* Tên sản phẩm */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Product Name</label>
                        <input type="text" 
                                className="form-control" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>

                <div className="row">
                    {/* Giá sản phẩm */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Price</label>
                        <input type="number" 
                                className="form-control" 
                                value={price} 
                                onChange={(e) => setPrice(Number(e.target.value))} />
                    </div>
                    {/* Số lượng */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Quantity</label>
                        <input type="number" 
                                className="form-control" 
                                value={quantity} 
                                onChange={(e) => setQuantity(Number(e.target.value))} />
                    </div>
                </div>

                <div className="row">
                    {/* Danh mục sản phẩm */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Category</label>
                        <select className="form-control" 
                                value={categoryId ?? ''} 
                                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)} required >
                            <option value="">-- Select Category --</option>
                            {listCategory.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* THÊM TRƯỜNG PRODUCT TYPE Ở ĐÂY */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Product Type</label>
                        <select 
                            className="form-select" 
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
                            required
                        >
                            <option value="">-- Select Product Type --</option>
                            <option value="No type">No type</option>
                            <option value="pizza cake traditional">Pizza Cake Traditional</option>
                            <option value="pizza cake seafood">Pizza Cake Seafood</option>
                            <option value="pizza mixed">Pizza Mixed</option>
                            <option value="pizza vegetarian">Pizza Vegetarian</option>
                            <option value="noodle">Noodle</option>
                            <option value="drinking water">Drinking Water</option>
                            <option value="pizza combo">Pizza Special</option>
                        </select>
                    </div>

                    {/* Trạng thái hoạt động */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Status</label>
                        <div className="form-check form-switch mt-2">
                            <input className="form-check-input" 
                                    type="checkbox" 
                                    checked={isActive === 1} 
                                    onChange={(e) => setIsActive(e.target.checked ? 1 : 0)} />
                            <label className="form-check-label">Active</label>
                        </div>
                    </div>
                </div>

                {/* Mô tả ngắn */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Short Description</label>
                    <textarea className="form-control" 
                              rows={2} 
                              value={shortDescription} 
                              onChange={(e) => setShortDescription(e.target.value)} />
                </div>

                {/* Mô tả chi tiết */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Detailed Description</label>
                    <textarea className="form-control" 
                              rows={4} 
                              value={description} 
                              onChange={(e) => setDescription(e.target.value)} />
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