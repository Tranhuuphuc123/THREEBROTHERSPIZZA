package webpizza.com.vn.webapp.DTO.AuthDTO;

import lombok.AllArgsConstructor;

/*AuthRequestDTO lop DTO xac thuc Auth */

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequestDTO {
    public String userName;
    public String passWord;
}
