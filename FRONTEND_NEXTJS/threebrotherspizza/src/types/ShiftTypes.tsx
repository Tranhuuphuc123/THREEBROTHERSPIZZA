export interface ShiftTypes {
    id: number;
    shiftName: string;
    startTime: string; // Kiểu ISO string
    endTime: string;    // Kiểu ISO string
    wageMultiplier: number;
    bonus: number;
}

/***interface cho dữ kiểu  trả về response của hàm fetchProduct*******/
export interface ApiResponseTypes {
    data: ShiftTypes[];
    totalPage: number;
    totalElement: number;
}


/***interface cho dữ kiểu dữ liệu cho page.tsx của create product -> truyền props cho page *******/
export interface CreateShiftPropsTypes {
   onReload?: () => void; //? truyền cũng đc mà không cũng đc
}

/**interface cho kiểu dữ liệu của page.tsx của delete product -> truyền props cho page**/
export interface DeleteShiftPropsTypes {
    id: number;
    onReload?: () => void;
}