export interface SalaryLevelTypes {
    id: number;
    levelName: string;
    hourlyWage: number;
    description: string;    
}

/***interface cho dữ kiểu  trả về response của hàm fetchProduct*******/
export interface ApiResponseTypes {
    data: SalaryLevelTypes[];
    totalPage: number;
    totalElement: number;
}


/***interface cho dữ kiểu dữ liệu cho page.tsx của create product -> truyền props cho page *******/
export interface CreateSalaryLevelPropsTypes {
   onReload?: () => void; //? truyền cũng đc mà không cũng đc
}

/**interface cho kiểu dữ liệu của page.tsx của delete product -> truyền props cho page**/
export interface DeleteSalaryLevelPropsTypes {
    id: number;
    onReload?: () => void;
}

/**nterface cho kiểu dữ liệu cho page.tsx của edit product -> truyền props cho page *******/
export interface EditSalaryLevelPropsTypes {
    id: number;
    onReload?: () => void;
}