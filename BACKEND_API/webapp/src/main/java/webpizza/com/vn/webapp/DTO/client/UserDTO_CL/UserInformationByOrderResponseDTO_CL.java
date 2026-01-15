/*đây là lớp dto trả về các thông tin cần thiết từ từ token khi login sinh ra token 
lớp này phục vụ chức năng đổ lấy thông tin user từ token trên localstorage 
đổ lên phần thông tin người dùng khi tiến hành đặt hàng */
package webpizza.com.vn.webapp.DTO.client.UserDTO_CL;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserInformationByOrderResponseDTO_CL {
    private String name;
    private String username;
    private String phone;
    private String email;
}
