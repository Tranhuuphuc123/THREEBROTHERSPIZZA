package webpizza.com.vn.webapp.DTO.AuthDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/* DTO giành cho xác thực phần quyền  */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPermissionsResponseDTO {
    public String username;
    public String name; //name là name của permissions á 
    public String displayName; // tên chi  tiết của permissions đó là gì cụ thể
}
