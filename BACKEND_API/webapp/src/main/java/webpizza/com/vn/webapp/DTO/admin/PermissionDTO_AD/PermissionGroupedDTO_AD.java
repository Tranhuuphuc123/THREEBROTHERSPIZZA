package webpizza.com.vn.webapp.DTO.admin.PermissionDTO_AD;

import lombok.AllArgsConstructor;
import lombok.Data;
import webpizza.com.vn.webapp.entity.Permission;
import java.util.List;

/* DTO này có tác dụng trả về loạt list name của permission và nhóm nó 
vào module_name đc thể hiện ở biến name trong dto này */
@Data
@AllArgsConstructor
public class PermissionGroupedDTO_AD {
    // Đây chính là module_name (vd: Account Manage)
    private String name; 

    // Danh sách tên name permission các quyền thuộc module đó
    private List<Permission> permissions; 
}