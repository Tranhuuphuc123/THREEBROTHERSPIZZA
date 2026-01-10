package webpizza.com.vn.webapp.DTO.client.UserDTO_CL;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserCreateRequestDTO_CL {
    
    @NotBlank(message = "userName cannot empty")
    @Length(min = 3, max = 70, message = "userName must have at least 3 character")
    private String username;

    @NotBlank(message = "password cannot empty")
    @Length(min = 6, max = 128, message = "password must have at least 6 - 128 character")
    private String password;

    @NotBlank(message = "email cannot empty")
    private String email;
}
