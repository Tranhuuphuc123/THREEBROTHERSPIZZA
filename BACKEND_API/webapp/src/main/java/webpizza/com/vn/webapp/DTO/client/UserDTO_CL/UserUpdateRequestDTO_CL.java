package webpizza.com.vn.webapp.DTO.client.UserDTO_CL;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;

import org.hibernate.validator.constraints.Length;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserUpdateRequestDTO_CL {

    @NotBlank(message = "khogn dc de name trong")
    @Length(min = 3, max = 70, message = "ten name phai co it nhat la 3 ky tu")
    private String name;

    @NotBlank(message = "khogn dc de username trong")
    @Length(min = 3, max = 70, message = "ten username phai co it nhat la 3 ky tu")
    private String username;

    @NotBlank(message = "mat khau khong dc de trong")
    @Length(min = 6, max = 128, message = "mk it nhat la phai co 6 -128 ky tu")
    private String password;

    @NotNull(message = "khong dc de trong")
    private Integer gender;

    @NotNull(message = "khong dc de trong ngay sinh")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @JsonDeserialize(using = LocalDateDeserializer.class) // Thêm dòng này vào
    private LocalDate birthday;

    @NotBlank(message = "khong dc de trong email")
    @Email(message = "phai dung cau truc email la <name@gmail.com>")
    private String email;

    @Pattern(message = "phai dung cau truc sdt; xxxx-xxx-xxx", regexp = "^\\d{4}\\d{3}\\d{3}$")
    private String phone;

    @NotBlank(message = "khong dc de trong dia chi nha may")
    @Length(max = 500)
    private String address;

    @NotNull(message = "Mức lương không được để trống")
    @Min(value = 1, message = "Mức lương thấp nhất là 1")
    private Integer levelId; //value = 1 là chấp nhận số từ 1 trở lên

    @NotNull(message = "khong dc de trong")
    private Integer isActive;
}
