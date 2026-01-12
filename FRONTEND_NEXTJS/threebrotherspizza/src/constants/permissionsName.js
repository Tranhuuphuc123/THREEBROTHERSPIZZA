/* file này cấu hình tên các quyền permission có trong database 
nhằm import so sánh với qyền trả về từ localstorage khi login thành 
công trả về các quyền tương ứng của user lưu trong localstorage 
sau đó dùng nó so sánh khớp quyền đó thì cho phép user đó call đc api 
thực thi chức năng đó */


// Nhóm quyền của table user
export const USER_VIEW = "user_view"
export const USER_CREATE = "user_create"
export const USER_UPDATE = "user_update"
export const USER_DELETE = "user_delete"


//Nhóm quyền của table roles
export const ROLE_VIEW =  "role_view"
export const ROLE_CREATE = "role_create"
export const ROLE_UPDATE=  "role_update"
export const ROLE_DELETE =  "role_delete"

//Nhóm quyền của table permission
export const PER_VIEW = "permission_view"
export const PER_CREATE = "permission_create"
export const PER_UPDATE = "permission_update"
export const PER_DELETE = "permission_delete"

//Nhóm quyenf của table phân quyền và vai trò
export const USERS_ROLES = "users_roles_view"
export const ROLES_PERMISSIONS = "roles_permissions_view"


//Nhóm quyền của table products
export const PRODUCT_VIEW = "product_view"
export const PRODUCT_CREATE = "product_create"
export const PRODUCT_UPDATE = "product_update"
export const PRODUCT_DELETE = "product_delete"

//nhom quyen cua table supplỉer
export const SUPPLIER_VIEW = "supplier_view"
export const SUPPLIER_CREATE = "supplier_create"
export const SUPPLIER_EDIT = "supplier_edit"
export const SUPPLIER_DELTE = "supplier_delete"

//nhom quyen cua table promotions
export const PROMOTIONS_VIEW = "promotion_view"
export const PROMOTIONS_CREATE = "promotion_create"
export const PROMOTIONS_EDIT = "promotion_edit"
export const PROMOTIONS_DELETE = "promotion_delete"

//nhom quyen cua table category
export const CATEGORY_VIEW = "category_view"
export const CATEGORY_CREATE = "category_create"
export const CATEGORY_EDIT = "category_edit"
export const CATEGORY_DELETE = "category_delete"

//nhom quyen cua table material
export const MATERIAL_VIEW = "material_view"
export const MATERIAL_CREATE = "material_create"
export const MATERIAL_EDIT = "material_edit"
export const MATERIAL_DELETE = "material_delete"

//nhom quyen cua table product_material
export const PRODUCT_MATERIAL_VIEW = "product_material_view"
export const PRODUCT_MATERIAL_CREATE = "product_material_create"
export const PRODUCT_MATERIAL_EDIT = "product_material_edit"
export const PRODUCT_MATERIAL_DELETE = "product_material_delete"

//nhom quyen cua table salary_level
export const SALARY_LEVEL_VIEW = "salary_level_view"
export const SALARY_LEVEL_CREATE = "salary_level_create"
export const SALARY_LEVEL_EDIT = "salary_level_edit"
export const SALARY_LEVEL_DELTE = "salary_level_delete"

//nhom quyen cua table shifts
export const SHIFT_VIEW = "shitf_view"
export const SHIFT_CREATE = "shitf_create"
export const SHIFT_EDIT = "shitf_edit"
export const SHIFT_DELTE = "shitf_delete"

