export interface SupplierTypes {
    id: number;
    code: string;
    name: string;
    img: string;    // Tên file ảnh lưu trên server
    phone: string;
    address: string;
    description: string
}

/***interface cho dữ kiểu  trả về response của hàm fetchProduct*******/
export interface ApiResponseTypes {
    data: SupplierTypes[];
    totalPage: number;
    totalElement: number;
}


/***interface cho dữ kiểu dữ liệu cho page.tsx của create product -> truyền props cho page *******/
export interface CreateSupplierPropsTypes {
   onReload?: () => void; //? truyền cũng đc mà không cũng đc
}