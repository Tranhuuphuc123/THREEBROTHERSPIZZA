package webpizza.com.vn.webapp.DTO.AuthDTO;

/*AuthRequestDTO lop DTO xac thuc Auth */

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    public String token;
}
