package webpizza.com.vn.webapp.DTO.AuthDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/* DTO giành cho xác thực phân quyền */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPermissionsRequestDTO {
    public String username;
}
