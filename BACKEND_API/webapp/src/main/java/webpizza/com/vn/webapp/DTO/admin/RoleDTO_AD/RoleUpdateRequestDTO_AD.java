package webpizza.com.vn.webapp.DTO.admin.RoleDTO_AD;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleUpdateRequestDTO_AD {

    @NotBlank(message = "Name cannot empty")
    @Size(min = 3, message = "Names must have a minimum length of 3 characters.")
    private String name;

    @NotBlank(message = "displayName cannot empty")
    @Size(min = 3, message = "Names must have a minimum length of 3 characters.")
    private String displayName;

    @NotBlank(message = "guardName cannot empty")
    @Size(min = 3, message = "Names must have a minimum length of 3 characters.")
    private String guardName;
}
