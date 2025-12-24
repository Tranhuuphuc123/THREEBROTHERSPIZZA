package webpizza.com.vn.webapp.DTO.AuthDTO;

/*AuthRequestDTO lop DTO xac thuc Auth */

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    //trả token về payload có chứa: token trong đó có thêm (avatar và username)
    public String token;
    private String avatar;
    private String username;
}
