package webpizza.com.vn.webapp.DTO.admin.RoleHasPermissionsDTO_AD;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleHasPerBatchCreateRequestDTO_AD {
    @NotNull(message = "Do not use in role ID.")
    private Integer roleId;

    /*sở dĩ dùng list là create nhiều permission cho một role
    nên cần khai báo là list co permission để chứa nhiều name 
    permission cho mọt role khi create */
    @NotNull(message = "Do not use in permission ID.")
    private List<Integer> permissionId;
}
