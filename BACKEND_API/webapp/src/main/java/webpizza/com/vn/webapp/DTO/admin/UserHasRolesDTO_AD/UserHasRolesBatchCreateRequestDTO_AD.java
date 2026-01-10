package webpizza.com.vn.webapp.DTO.admin.UserHasRolesDTO_AD;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserHasRolesBatchCreateRequestDTO_AD {
    @NotNull(message = "userIs cannot empty")
    private Integer userId;

    @NotNull(message = "roleIds cannot empty")
    private List<Integer> roleIds;
}
