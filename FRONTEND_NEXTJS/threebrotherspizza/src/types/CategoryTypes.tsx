export interface CategoryTypes {
    id: number;
    code: string;
    name: string;
    description: string
}

/***interface cho dữ kiểu  trả về response của hàm fetchProduct*******/
export interface ApiResponseTypes {
    data: CategoryTypes[];
    totalPage: number;
    totalElement: number;
}


/***interface cho dữ kiểu dữ liệu cho page.tsx của create product -> truyền props cho page *******/
export interface CreateCatPropsTypes {
   onReload?: () => void; //? truyền cũng đc mà không cũng đc
}

/**interface cho kiểu dữ liệu của page.tsx của delete product -> truyền props cho page**/
export interface DeleteCatPropsTypes {
    id: number;
    onReload?: () => void;
}

// Định nghĩa kiểu Props giống bài mẫu của bạn
export interface EditCatProps {
    id: number | null;
    onReload?: () => void;
}