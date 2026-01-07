
/*******tạo interface cho dữ liệu sản phẩm products *******/
export interface ProductTypes {
    id: string;
    code: string;
    name: string;
    image: string;
    shortDescription: string;
    description: string;
    price: number;
    quantity: number;
    isActive: number;
    categoryId: number;
    createAt: string;
    updateAt: string;
    productType:string
}


/***interface cho dữ kiểu dữ liệu cho page.tsx của create product -> truyền props cho page *******/
export interface CreateProductPropsTypes {
   onReload?: () => void; //? truyền cũng đc mà không cũng đc
}


/**nterface cho kiểu dữ liệu cho page.tsx của edit product -> truyền props cho page *******/
export interface EditProductPropsTypes {
    id: number;
    onReload?: () => void;
}