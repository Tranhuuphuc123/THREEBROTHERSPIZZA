export interface FeedbackTypes {
    id: number;
    productId: number;
    userId: number;
    rating: number;
    message: string;
    isActive: number;
}

/***interface cho dữ kiểu  trả về response của hàm fetchProduct*******/
export interface ApiResponseTypes {
    data: FeedbackTypes[];
    totalPage: number;
    totalElement: number;
}


/***interface cho dữ kiểu dữ liệu cho page.tsx của create product -> truyền props cho page *******/
export interface CreateFeedbackPropsTypes {
   onReload?: () => void; //? truyền cũng đc mà không cũng đc
}

/**interface cho kiểu dữ liệu của page.tsx của delete product -> truyền props cho page**/
export interface DeleteFeedbackPropsTypes {
    id: number;
    onReload?: () => void;
}

/**nterface cho kiểu dữ liệu cho page.tsx của edit product -> truyền props cho page *******/
export interface EditFeedbackPropsTypes {
    id: number;
    onReload?: () => void;
}