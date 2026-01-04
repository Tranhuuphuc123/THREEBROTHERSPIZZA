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
    @NotBlank(message = "khogn dc de username trong")
    @Length(min = 3, max = 70, message = "ten username phai co it nhat la 3 ky tu")
    private String username;

    @NotBlank(message = "mat khau khong dc de trong")
    @Length(min = 6, max = 128, message = "mk it nhat la phai co 6 -128 ky tu")
    private String password;

    @NotBlank(message = "Email khong dc de trong")
    private String email;
}
