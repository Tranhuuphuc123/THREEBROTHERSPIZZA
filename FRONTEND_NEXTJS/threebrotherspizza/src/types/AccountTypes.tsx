/* Interface định nghĩa kiểu dữ liệu cho các trường tương ứng với User entity từ Backend */
export interface AccountTypes {
    id: number;
    name: string;
    username: string;
    password?: string; // Dấu ? vì thường khi nhận data về ta không nhận password
    gender: number;    // 1: Nam, 0: Nữ (tùy định nghĩa của bạn)
    birthday: string;  // Kiểu LocalDate từ Java gửi qua JSON sẽ là string (YYYY-MM-DD)
    email: string;
    avatar: string;    // Tên file ảnh lưu trên server
    phone: string;
    address: string;
    levelId: number;   // Tương ứng với salary_level_id
    createdAt: string; // Kiểu ISO string
    updatedAt: string; // Kiểu ISO string
    isActive: number;  // 1: Hoạt động, 0: Khóa
    
    // Nếu bạn cần lấy danh sách quyền/vai trò trả về cùng User
    listRoles?: RoleTypes[]; 
}

/* Định nghĩa thêm RoleTypes nếu bạn sử dụng listRoles */
export interface RoleTypes {
    id: number;
    name: string; // Ví dụ: ROLE_USER, ROLE_ADMIN
    description?: string;
}

/***interface cho dữ kiểu  trả về response của hàm fetchProduct*******/
export interface ApiResponseTypes {
    data: AccountTypes[];
    totalPage: number;
    totalElement: number;
}


/***interface cho dữ kiểu dữ liệu cho page.tsx của create product -> truyền props cho page *******/
export interface CreateAccountPropsTypes {
//    listProduct: ProductTypes[];
//    setListProduct: React.Dispatch<React.SetStateAction<ProductTypes[]>>;
   onReload?: () => void; //? truyền cũng đc mà không cũng đc
}

/**interface cho kiểu dữ liệu của page.tsx của delete product -> truyền props cho page**/
export interface DeleteAccountPropsTypes {
    id: number;
    onReload?: () => void;
}

/**nterface cho kiểu dữ liệu cho page.tsx của edit product -> truyền props cho page *******/
export interface EditAccountPropsTypes {
    id: number;
    onReload?: () => void;
}