export interface PromotionTypes {
    id: number;
    name: string;
    discount: number;
    description: string;    // Tên file ảnh lưu trên server
    isActive: number;
    startDate: string;
    endDate:string
}

export interface ApiResponseTypes {
    data: PromotionTypes[];
    totalPage: number;
    totalElement: number;
}


/***interface cho dữ kiểu dữ liệu cho page.tsx của create product -> truyền props cho page *******/
export interface CreateProPropsTypes {
   onReload?: () => void; //? truyền cũng đc mà không cũng đc
}

/**interface cho kiểu dữ liệu của page.tsx của delete product -> truyền props cho page**/
export interface DeleteProPropsTypes {
    id: number;
    onReload?: () => void;
}

// Định nghĩa kiểu Props giống bài mẫu của bạn
export interface EditPromotionProps {
    id: number | null;
    onReload?: () => void;
}