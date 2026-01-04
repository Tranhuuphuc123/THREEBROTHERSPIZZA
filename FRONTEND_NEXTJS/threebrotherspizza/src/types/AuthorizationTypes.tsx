
/* định kiêu types cho các phần của nhóm chức năng phân quyền */
export interface PermissionTypes { 
    id: number; 
    name: string; 
    display_name?: string; 
    module_name?: string; 
}


export interface ModuleGroup { 
    id: string; 
    name: string; 
    permissions: PermissionTypes[]; 
}


export interface Role { 
    id: number; 
    name: string; 
}
