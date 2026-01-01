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